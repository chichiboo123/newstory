/**
 * AI 제공자 추상화.
 *
 * 기본값은 API 없이 동작하는 LocalRuleProvider입니다.
 * 빌드 시 GEMINI_API_KEY가 주입되면 GeminiProvider가 활성화됩니다.
 * (정적 호스팅 특성상 키 노출 위험이 있으므로 전용 키·리퍼러 제한·사용량 상한 필수. README 참고)
 */

export interface IdeaRequest {
  /** 아이디어가 필요한 요소 (예: 'protagonist', 'ending', 'next-event') */
  topic: string;
  /** 원작 동화 제목 등 짧은 맥락 */
  context: string;
}

export interface IdeaResponse {
  /** 항상 3개의 서로 다른 아이디어를 제안 (확정하지 않고 어린이가 선택) */
  ideas: { title: string; description: string }[];
}

export interface SceneRewriteRequest {
  /** 이전 장면 요약 (전체 원문을 보내지 않음) */
  previousSummary: string;
  /** 현재 장면 요약 */
  currentSummary: string;
  /** 다음 장면 요약 */
  nextSummary: string;
  /** 어린이가 쓴 내용 */
  childDraft: string;
}

export interface SceneRewriteResponse {
  /** 장면 연결 문장 제안 (어린이의 글을 대체하지 않음) */
  connectorSuggestions: string[];
  /** 이어 쓸 문장 시작 제안 */
  starterSuggestions: string[];
}

export interface ConsistencyRequest {
  characterNames: string[];
  sceneTexts: string[];
}

export interface ConsistencyIssue {
  sceneIndex: number;
  message: string;
}

export interface ConsistencyResponse {
  issues: ConsistencyIssue[];
  praise: string;
}

export interface AIProvider {
  /** 제공자 이름 (설정 화면 표시용) */
  readonly name: string;
  /** 외부 서버 필요 여부 */
  readonly requiresEndpoint: boolean;
  generateIdeas(input: IdeaRequest): Promise<IdeaResponse>;
  rewriteScene(input: SceneRewriteRequest): Promise<SceneRewriteResponse>;
  reviewConsistency(input: ConsistencyRequest): Promise<ConsistencyResponse>;
}
