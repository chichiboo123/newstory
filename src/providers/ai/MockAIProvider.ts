import type {
  AIProvider,
  IdeaRequest,
  IdeaResponse,
  SceneRewriteRequest,
  SceneRewriteResponse,
  ConsistencyRequest,
  ConsistencyResponse,
} from './types';

/** 개발·테스트용 고정 응답 제공자 */
export class MockAIProvider implements AIProvider {
  readonly name = '테스트 도우미';
  readonly requiresEndpoint = false;

  async generateIdeas(input: IdeaRequest): Promise<IdeaResponse> {
    return {
      ideas: [
        { title: `아이디어 A (${input.topic})`, description: '테스트용 아이디어입니다.' },
        { title: `아이디어 B (${input.topic})`, description: '테스트용 아이디어입니다.' },
        { title: `아이디어 C (${input.topic})`, description: '테스트용 아이디어입니다.' },
      ],
    };
  }

  async rewriteScene(_input: SceneRewriteRequest): Promise<SceneRewriteResponse> {
    return {
      connectorSuggestions: ['테스트 연결 문장입니다.'],
      starterSuggestions: ['테스트 시작 문장입니다.'],
    };
  }

  async reviewConsistency(_input: ConsistencyRequest): Promise<ConsistencyResponse> {
    return { issues: [], praise: '테스트 응답: 잘하고 있어요!' };
  }
}
