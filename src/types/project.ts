/**
 * 어린이가 만드는 각색 프로젝트 데이터 타입.
 *
 * 줄거리 다시 쓰기(plot)는 조지프 캠벨(Joseph Campbell)의 영웅의 여정을
 * 어린이용 6단계로 단순화한 뼈대를 따르고,
 * 장면별 다시 쓰기(scene)는 스타인과 글렌(Stein & Glenn)의 이야기 문법
 * (배경 → 계기 사건 → 마음속 반응 → 시도 → 결과 → 마무리)을 골격으로 사용합니다.
 */

export type RewriteMode = 'plot' | 'scene';

/** 줄거리 다시 쓰기에서 바꿀 수 있는 요소 */
export type PlotElementKey =
  | 'protagonist'
  | 'personality'
  | 'ability'
  | 'wish'
  | 'sidekick'
  | 'antagonist'
  | 'era'
  | 'place'
  | 'problem'
  | 'object'
  | 'relationship'
  | 'mood'
  | 'solution'
  | 'ending'
  | 'message';

/** 각 요소의 입력 방식 */
export type ElementChoiceMode = 'original' | 'preset' | 'custom';

export interface PlotElementChange {
  key: PlotElementKey;
  mode: ElementChoiceMode;
  /** mode가 original이 아닐 때의 새 값 */
  value: string;
}

export interface CharacterChange {
  /** 원작 인물 id. 새 인물이면 'new-' 접두사 */
  characterId: string;
  name: string;
  age: string;
  genderExpression: string;
  /** 인간·동물·사물·상상 존재 */
  beingType: string;
  personality: string;
  roleOrJob: string;
  ability: string;
  weakness: string;
  goal: string;
  speechStyle: string;
  relationships: string;
}

export interface RewrittenScene {
  /** 원작 장면 id. 새로 추가한 장면이면 'new-' 접두사 */
  sceneId: string;
  /** 어린이가 다시 쓴 장면 내용 */
  content: string;
  /** 원작 그대로 두기 여부 */
  keepOriginal: boolean;
  /** 장면 제목(바꿨을 때) */
  newTitle: string;
}

export interface Reflection {
  /** 원작에서 바꾼 부분 (직접 정리) */
  whatChanged: string;
  /** 가장 마음에 드는 장면 */
  favoriteScene: string;
  /** 이야기에 담고 싶은 생각 */
  message: string;
}

export interface RewriteProject {
  id: string;
  sourceStoryId: string;
  projectTitle: string;
  creatorNickname: string;
  mode: RewriteMode;
  /** 줄거리 모드: 요소별 변경 사항 */
  plotChanges: PlotElementChange[];
  /** 줄거리 모드: 어린이가 쓴 새 줄거리 (영웅의 여정 6단계) */
  plotDraft: string[];
  /** 인물 변경 사항 */
  characterChanges: CharacterChange[];
  /** 장면 모드: 장면별 다시 쓴 내용 */
  rewrittenScenes: RewrittenScene[];
  reflection: Reflection;
  /** 진행 단계 (1~5) */
  currentStep: number;
  createdAt: string;
  updatedAt: string;
}

/** JSON 내보내기 파일 형식 */
export interface ProjectExport {
  app: 'hello-story';
  version: 1;
  exportedAt: string;
  project: RewriteProject;
}
