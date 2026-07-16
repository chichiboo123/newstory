import type {
  AIProvider,
  IdeaRequest,
  IdeaResponse,
  SceneRewriteRequest,
  SceneRewriteResponse,
  ConsistencyRequest,
  ConsistencyResponse,
} from './types';

/**
 * Google Gemini 제공자.
 *
 * 키 주입: 빌드 시 GitHub Actions Secret(GEMINI_API_KEY)이 VITE_GEMINI_API_KEY로 들어옵니다.
 * 어린이/사용자에게 키 입력을 요구하지 않습니다.
 *
 * ⚠️ 보안 주의: GitHub Pages는 정적 호스팅이라 빌드 결과물에 포함된 키는 브라우저에서
 * 확인될 수 있습니다. 반드시 (1) 전용 키를 사용하고 (2) Google AI Studio에서
 * HTTP 리퍼러 제한을 배포 도메인으로 걸고 (3) 사용량 상한을 설정하세요. (README 참고)
 *
 * 호출 순서(다른 앱과 동일한 지침):
 *  1) 필요한 요약만 최소로 구성  2) 캐시 확인  3) 진행 중 중복요청 잠금
 *  4) Gemini 호출(구조화 JSON)   5) 실패 시 백오프 재시도
 *  6) 그래도 실패면 규칙 기반(Local)으로 대체(호출 측 처리)  7) 결과 캐시
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

/**
 * 모델 폴백 체인: 앞에서부터 호출하고, 실패하면(모델 없음/한도/오류) 다음 모델로 넘어갑니다.
 * 마지막 두 모델(2.5 계열)은 안정적으로 제공되므로 항상 대체 경로가 됩니다.
 * VITE_GEMINI_MODELS(쉼표 구분) 또는 VITE_GEMINI_MODEL로 덮어쓸 수 있습니다.
 */
const DEFAULT_CHAIN = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

function resolveChain(): string[] {
  const list = (import.meta.env.VITE_GEMINI_MODELS as string | undefined)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (list && list.length) return list;
  const single = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim();
  return single ? [single] : DEFAULT_CHAIN;
}

export const MODEL_CHAIN: string[] = resolveChain();

/** 키가 빌드에 주입되었는지 여부 */
export function hasGeminiKey(): boolean {
  return typeof API_KEY === 'string' && API_KEY.trim().length > 0;
}

/** 사람이 읽기 좋은 모델 이름 (예: gemini-3.1-flash-lite → Gemini 3.1 Flash Lite) */
export function formatModelName(id: string): string {
  return id
    .split('-')
    .map((p) => (p === 'gemini' ? 'Gemini' : /^\d/.test(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ');
}

// ── 현재 사용 중인 모델 추적 (배터리 표시등용) ─────────────────
let activeModel: string | null = null;
const modelListeners = new Set<() => void>();

/** 마지막으로 성공한(=현재 대화 중인) 모델 id. 아직 호출 전이면 null */
export function getActiveModel(): string | null {
  return activeModel;
}

export function subscribeActiveModel(cb: () => void): () => void {
  modelListeners.add(cb);
  return () => modelListeners.delete(cb);
}

function setActiveModel(id: string) {
  if (activeModel === id) return;
  activeModel = id;
  modelListeners.forEach((l) => l());
}

/** 어린이 창작 조력자로서 지켜야 할 시스템 지침 (기획서 5장 원칙 반영) */
const SYSTEM_INSTRUCTION = `당신은 초등학생의 이야기 창작을 돕는 다정한 조력자입니다.
반드시 지킬 원칙:
- 사용자는 어린이입니다. 어린이의 생각과 표현을 가장 먼저 존중하세요.
- 완성된 이야기를 대신 써 주지 말고, 어린이가 고를 수 있는 짧은 아이디어와 질문을 주세요.
- 어린이가 정한 핵심 설정을 임의로 바꾸지 마세요.
- 초등학생이 이해하기 쉬운 한국어로, 짧고 친근하게 쓰세요.
- 무섭거나 폭력적이거나 부적절한 표현을 만들지 마세요.
- 현대 출판물·영화·애니메이션의 고유한 대사나 설정을 모방하지 마세요.
- 반드시 지정된 JSON 형식으로만 답하세요.`;

interface GeminiSchema {
  type: string;
  properties?: Record<string, GeminiSchema>;
  items?: GeminiSchema;
  required?: string[];
  enum?: string[];
}

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function cacheKey(method: string, input: unknown): string {
  return `${method}:${JSON.stringify(input)}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 단일 모델로 1회 호출 (429/503은 1회 백오프 재시도) */
async function callOnce<T>(model: string, userPrompt: string, schema: GeminiSchema): Promise<T> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  };
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if ((res.status === 429 || res.status === 503) && attempt === 0) {
      await sleep(500);
      continue; // 일시적 혼잡: 같은 모델 1회 재시도
    }
    if (!res.ok) throw new Error(`${model} 오류: ${res.status}`);
    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error(`${model} 응답이 비어 있음`);
    return JSON.parse(text) as T;
  }
  throw new Error(`${model} 재시도 실패`);
}

/**
 * 모델 체인을 앞에서부터 시도하고, 실패하면 다음 모델로 넘어갑니다.
 * 성공한 모델을 현재 사용 모델로 기록합니다(배터리 표시등).
 */
async function callGemini<T>(userPrompt: string, schema: GeminiSchema): Promise<T> {
  if (!hasGeminiKey()) throw new Error('Gemini API 키가 없습니다.');
  let lastErr: unknown;
  for (const model of MODEL_CHAIN) {
    try {
      const out = await callOnce<T>(model, userPrompt, schema);
      setActiveModel(model); // 이 모델로 대화 중
      return out;
    } catch (e) {
      lastErr = e; // 다음 모델로 폴백
    }
  }
  throw lastErr ?? new Error('모든 Gemini 모델 호출 실패');
}

/** 캐시 + 중복요청 잠금으로 감싼 호출 */
async function cached<T>(method: string, input: unknown, run: () => Promise<T>): Promise<T> {
  const key = cacheKey(method, input);
  if (cache.has(key)) return cache.get(key) as T;
  if (inflight.has(key)) return inflight.get(key) as Promise<T>;
  const p = (async () => {
    const out = await run();
    cache.set(key, out);
    inflight.delete(key);
    return out;
  })();
  inflight.set(key, p);
  return p;
}

export class GeminiProvider implements AIProvider {
  readonly name = 'Gemini 창작 도우미';
  readonly requiresEndpoint = false;

  generateIdeas(input: IdeaRequest): Promise<IdeaResponse> {
    return cached('ideas', input, () =>
      callGemini<IdeaResponse>(
        `원작 동화 "${input.context}"를 각색하는 어린이를 돕습니다.
"${input.topic}" 항목에 대해 서로 다른 아이디어 3개를 제안하세요.
각 아이디어는 title(짧은 이름)과 description(한 문장 설명, 어린이 말투)로 구성합니다.`,
        {
          type: 'OBJECT',
          properties: {
            ideas: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: { title: { type: 'STRING' }, description: { type: 'STRING' } },
                required: ['title', 'description'],
              },
            },
          },
          required: ['ideas'],
        },
      ),
    );
  }

  rewriteScene(input: SceneRewriteRequest): Promise<SceneRewriteResponse> {
    return cached('scene', input, () =>
      callGemini<SceneRewriteResponse>(
        `어린이가 쓴 장면을 앞뒤와 자연스럽게 잇도록 돕습니다. 대신 써 주지 마세요.
이전 장면 요약: ${input.previousSummary || '(없음)'}
현재 장면 요약: ${input.currentSummary}
다음 장면 요약: ${input.nextSummary || '(없음)'}
어린이가 쓴 내용: ${input.childDraft || '(아직 없음)'}
- connectorSuggestions: 앞뒤 장면을 잇는 짧은 연결 문장 3개
- starterSuggestions: 이어 쓸 때 쓸 수 있는 문장 시작 3개`,
        {
          type: 'OBJECT',
          properties: {
            connectorSuggestions: { type: 'ARRAY', items: { type: 'STRING' } },
            starterSuggestions: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['connectorSuggestions', 'starterSuggestions'],
        },
      ),
    );
  }

  reviewConsistency(input: ConsistencyRequest): Promise<ConsistencyResponse> {
    return cached('consistency', input, () =>
      callGemini<ConsistencyResponse>(
        `어린이가 쓴 이야기의 흐름과 인물 일관성을 부드럽게 살펴봅니다. 비난하지 말고 응원하세요.
등장인물: ${input.characterNames.join(', ') || '(없음)'}
장면들(순서대로): ${input.sceneTexts.map((t, i) => `[${i}] ${t || '(빈 장면)'}`).join(' / ')}
- issues: 고치면 좋을 점 목록. 각 항목은 sceneIndex(0부터)와 message(어린이용 다정한 제안).
  문제가 없으면 빈 배열.
- praise: 잘한 점을 담은 짧은 칭찬 한 문장.`,
        {
          type: 'OBJECT',
          properties: {
            issues: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  sceneIndex: { type: 'INTEGER' },
                  message: { type: 'STRING' },
                },
                required: ['sceneIndex', 'message'],
              },
            },
            praise: { type: 'STRING' },
          },
          required: ['issues', 'praise'],
        },
      ),
    );
  }
}
