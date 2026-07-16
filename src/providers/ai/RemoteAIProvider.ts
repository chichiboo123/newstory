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
 * 안전한 외부 프록시 엔드포인트가 있을 때만 사용하는 원격 제공자.
 *
 * 보안 원칙:
 * - API 키는 절대 프론트엔드에 두지 않습니다. 엔드포인트 서버(교사/기관 운영 프록시)가
 *   키를 보관하고, 이 앱은 키 없이 프록시 URL로만 요청합니다.
 * - 요청에는 필요한 요약 정보만 담아 최소한으로 보냅니다.
 * - 실패 시 예외를 던지며, 호출 측(useAI 훅)이 LocalRuleProvider로 대체합니다.
 */
export class RemoteAIProvider implements AIProvider {
  readonly name = '외부 AI 도우미 (교사용 프록시 연결됨)';
  readonly requiresEndpoint = true;

  constructor(private endpoint: string) {}

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.endpoint.replace(/\/$/, '')}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`AI 서버 오류: ${res.status}`);
    return (await res.json()) as T;
  }

  generateIdeas(input: IdeaRequest): Promise<IdeaResponse> {
    return this.post<IdeaResponse>('/ideas', input);
  }

  rewriteScene(input: SceneRewriteRequest): Promise<SceneRewriteResponse> {
    return this.post<SceneRewriteResponse>('/scene', input);
  }

  reviewConsistency(input: ConsistencyRequest): Promise<ConsistencyResponse> {
    return this.post<ConsistencyResponse>('/consistency', input);
  }
}
