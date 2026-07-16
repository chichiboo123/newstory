import type {
  AIProvider,
  IdeaRequest,
  IdeaResponse,
  SceneRewriteRequest,
  SceneRewriteResponse,
  ConsistencyRequest,
  ConsistencyResponse,
  ConsistencyIssue,
} from './types';
import {
  PLOT_ELEMENTS,
  PROPP_EVENT_CARDS,
  CONNECTOR_SENTENCES,
  SENTENCE_STARTERS,
  THINKING_STARTERS,
} from '../../data/rewrite-options';

/** 배열에서 서로 다른 n개를 무작위로 뽑기 */
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

/**
 * API 없이 동작하는 규칙 기반 아이디어 제공자 (기본값).
 * 프로프의 이야기 기능 카드와 요소별 추천 목록을 조합해
 * 어린이가 고를 수 있는 아이디어 3개를 제안합니다.
 */
export class LocalRuleProvider implements AIProvider {
  readonly name = '이야기 카드 도우미 (인터넷 연결 불필요)';
  readonly requiresEndpoint = false;

  async generateIdeas(input: IdeaRequest): Promise<IdeaResponse> {
    const element = PLOT_ELEMENTS.find((e) => e.key === input.topic);
    if (element) {
      const picks = pickRandom(element.presets, 3);
      return {
        ideas: picks.map((p) => ({
          title: p,
          description: `${element.label}을(를) "${p}"(으)로 바꾸면 어떤 일이 생길지 상상해 보세요.`,
        })),
      };
    }
    if (input.topic === 'next-event') {
      const cards = pickRandom(PROPP_EVENT_CARDS, 3);
      return { ideas: cards.map((c) => ({ title: c.title, description: c.description })) };
    }
    // 기본: 생각 열기 질문 제안
    const questions = pickRandom(THINKING_STARTERS, 3);
    return {
      ideas: questions.map((q) => ({ title: '생각 열기', description: q })),
    };
  }

  async rewriteScene(_input: SceneRewriteRequest): Promise<SceneRewriteResponse> {
    return {
      connectorSuggestions: pickRandom(CONNECTOR_SENTENCES, 3),
      starterSuggestions: pickRandom(SENTENCE_STARTERS, 3),
    };
  }

  async reviewConsistency(input: ConsistencyRequest): Promise<ConsistencyResponse> {
    const issues: ConsistencyIssue[] = [];
    input.sceneTexts.forEach((text, i) => {
      const trimmed = text.trim();
      if (trimmed.length === 0) return; // 비어 있는 장면은 원작 유지로 간주
      if (trimmed.length < 15) {
        issues.push({
          sceneIndex: i,
          message: '이 장면이 조금 짧아요. 인물의 기분이나 그다음에 일어난 일을 한 문장 더 써 볼까요?',
        });
      }
      const mentionsAny = input.characterNames.some((n) => n && trimmed.includes(n));
      if (!mentionsAny && input.characterNames.length > 0 && trimmed.length >= 15) {
        issues.push({
          sceneIndex: i,
          message: '이 장면에는 등장인물의 이름이 보이지 않아요. 누가 나오는 장면인지 알려 주면 더 좋아요.',
        });
      }
    });
    return {
      issues,
      praise:
        issues.length === 0
          ? '이야기의 흐름이 잘 이어지고 있어요! 멋진 작가네요. ✨'
          : '이야기가 점점 자라나고 있어요! 아래 도움말을 참고해 보세요.',
    };
  }
}
