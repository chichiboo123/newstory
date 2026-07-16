/**
 * 동화 원작 데이터 타입.
 *
 * 장면 구조는 구스타프 프라이타크(Gustav Freytag)의 5단계 극 구성
 * (발단 → 상승 → 절정 → 하강 → 결말)을 따르고,
 * 인물 역할은 블라디미르 프로프(Vladimir Propp)의 등장인물 기능 이론을
 * 어린이 눈높이에 맞게 단순화하여 사용합니다.
 */

/** 프라이타크 피라미드 5단계 */
export type FreytagStage = 'exposition' | 'rising' | 'climax' | 'falling' | 'resolution';

export const FREYTAG_LABELS: Record<FreytagStage, string> = {
  exposition: '발단',
  rising: '전개',
  climax: '절정',
  falling: '하강',
  resolution: '결말',
};

/** 프로프의 행동 영역(7가지 인물 기능)을 어린이용으로 단순화한 역할 */
export type ProppRole =
  | 'hero' // 주인공
  | 'villain' // 방해 인물
  | 'helper' // 조력자
  | 'donor' // 증여자(지혜나 물건을 주는 인물)
  | 'dispatcher' // 파견자(주인공을 떠나보내는 인물)
  | 'sought' // 주인공이 찾는 대상(사람·보상)
  | 'false-hero'; // 가짜 주인공

export const PROPP_ROLE_LABELS: Record<ProppRole, string> = {
  hero: '주인공',
  villain: '방해 인물',
  helper: '조력자',
  donor: '지혜를 주는 인물',
  dispatcher: '길을 떠나게 하는 인물',
  sought: '주인공이 찾는 대상',
  'false-hero': '가짜 주인공',
};

export interface Relationship {
  targetId: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  /** 이야기 속 역할 설명 (예: "꾀 많은 막내") */
  role: string;
  /** 프로프 이론 기반 기능 역할 */
  proppRole: ProppRole;
  /** 인간 | 동물 | 사물 | 상상 존재 */
  type: string;
  appearance: string;
  personality: string[];
  strengths: string[];
  weaknesses: string[];
  goal: string;
  relationships: Relationship[];
  /** 이야기 속 변화 */
  change: string;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  location: string;
  characterIds: string[];
  /** 자체 작성 장면 요약 */
  summary: string;
  emotions: string[];
  conflict: string;
  /** 다음 장면으로 이어지는 사건 */
  nextConnection: string;
  /** 어린이가 바꿀 수 있는 요소 */
  editableElements: string[];
  /** 프라이타크 피라미드 단계 */
  stage: FreytagStage;
}

export interface SourceInfo {
  /** 원작 출처 (예: "그림 형제, 어린이와 가정의 동화(1812)") */
  origin: string;
  /** 퍼블릭 도메인 검토 메모 */
  publicDomainNote: string;
  /** 주의해야 할 현대 각색 요소 */
  modernAdaptationCaution: string;
  /** 콘텐츠 검토 상태 */
  reviewStatus: 'verified';
  /** 마지막 검토 날짜 */
  lastReviewed: string;
}

export interface CoverVisual {
  /** 표지를 상징하는 이모지 (자체 제작 썸네일용) */
  emoji: string;
  /** 표지 배경 그라디언트 색상 2개 */
  colors: [string, string];
}

export type StoryKind = '우화' | '민담' | '창작동화' | '전래동화' | '신화·전설';

export interface Story {
  id: string;
  titleKo: string;
  originalTitle: string;
  authorOrOrigin: string;
  countryOrRegion: string;
  originalLanguage: string;
  publicationPeriod: string;
  kind: StoryKind;
  /** 추천 연령 (예: "8세 이상") */
  ageRange: string;
  /** 예상 읽기 시간(분) */
  readingTime: number;
  themes: string[];
  /** 한 문장 소개 */
  oneLineIntro: string;
  /** 짧은 줄거리 (자체 작성 요약) */
  summary: string;
  /** 이야기의 배경 */
  background: string;
  /** 이야기 속 문제(중심 갈등) */
  conflict: string;
  /** 결말 */
  ending: string;
  /** 생각해 볼 질문 */
  thinkingQuestions: string[];
  characters: Character[];
  scenes: Scene[];
  sourceInfo: SourceInfo;
  coverVisual: CoverVisual;
}
