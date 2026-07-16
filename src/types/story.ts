/**
 * 동화 원작 데이터 타입.
 *
 * 장면 구조는 2022 개정 교육과정 국어과 지도서(4학년)에 제시된
 * 이야기의 구성 단계 '발단 → 전개 → 위기 → 절정 → 결말'을 따릅니다.
 * (출처: 김대조·김민중(2013), 『생각을 키우는 시와 동화 쓰기』, 꿈과희망.)
 * 각 동화는 5개의 장면으로 이루어져 장면 순서가 곧 구성 단계가 됩니다.
 *
 * 인물 역할은 블라디미르 프로프(Vladimir Propp)의 등장인물 기능 이론을
 * 어린이 눈높이에 맞게 단순화하여 사용합니다.
 */

/** 이야기의 구성 단계 (2022 개정 교육과정 국어과 지도서 기반) */
export type NarrativeStage = 'exposition' | 'development' | 'crisis' | 'climax' | 'denouement';

export const STAGE_ORDER: NarrativeStage[] = [
  'exposition',
  'development',
  'crisis',
  'climax',
  'denouement',
];

export const STAGE_LABELS: Record<NarrativeStage, string> = {
  exposition: '발단',
  development: '전개',
  crisis: '위기',
  climax: '절정',
  denouement: '결말',
};

/** 지도서에 제시된 각 단계 설명 (어린이용으로 다듬음) */
export const STAGE_DESCRIPTIONS: Record<NarrativeStage, string> = {
  exposition: '이야기가 시작돼요. 인물과 배경이 소개되고 사건의 실마리가 나타나요.',
  development: '사건이 본격적으로 펼쳐지고 인물 사이에 갈등이 생겨요.',
  crisis: '새로운 일이 벌어지고 갈등이 점점 커져서 절정으로 가는 계기가 돼요.',
  climax: '갈등이 가장 커지고, 문제를 풀 실마리가 보이는 가장 중요한 순간이에요.',
  denouement: '사건이 마무리되고 갈등이 풀리며 주인공의 이야기가 끝나요.',
};

/** 장면 순서(1부터)와 전체 장면 수로 구성 단계를 계산합니다. */
export function getStageByOrder(order: number, total: number): NarrativeStage {
  if (total <= 1) return STAGE_ORDER[0];
  const idx = Math.round(((order - 1) / (total - 1)) * (STAGE_ORDER.length - 1));
  return STAGE_ORDER[Math.min(Math.max(idx, 0), STAGE_ORDER.length - 1)];
}

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
