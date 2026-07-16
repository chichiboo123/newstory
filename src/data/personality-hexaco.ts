/**
 * 성격을 나타내는 말 — HEXACO 성격 모델 기반 낱말 카드.
 *
 * 학술·교육과정 근거:
 * - 2022 개정 교육과정 국어과 3학년 지도서 '성격을 나타내는 말'은 성격을 범주화하기 위해
 *   성격 심리학의 HEXACO 모델을 참고하고 있습니다.
 * - HEXACO 모델 출처: 유태용·이기범·Michael C. Ashton(2004),
 *   「한국판 HEXACO 성격 검사의 구성 타당화 연구」, 『한국심리학회지: 사회 및 성격』, 제18권 제3호.
 *
 * 6가지 성격 요인(정직성-겸손성, 정서성, 외향성, 원만성, 성실성, 개방성)별로
 * 서로 대비되는 성격 낱말을 어린이가 이해하기 쉬운 표현으로 정리했습니다.
 * '반대되는 말'도 나쁜 성격이 아니라 이야기를 재미있게 만드는 개성으로 안내합니다.
 */

export interface HexacoFactor {
  /** HEXACO 요인 키 */
  key: 'H' | 'E' | 'X' | 'A' | 'C' | 'O';
  /** 학술 명칭 */
  academicName: string;
  /** 어린이용 이름 */
  childName: string;
  /** 한쪽 성향의 낱말 */
  words: string[];
  /** 대비되는 성향의 낱말 */
  contrastWords: string[];
}

export const HEXACO_FACTORS: HexacoFactor[] = [
  {
    key: 'H',
    academicName: '정직성-겸손성 (Honesty-Humility)',
    childName: '정직하고 겸손한 마음',
    words: ['진실한', '솔직한', '겸손한', '공정한', '예의 바른', '믿음직한', '착한'],
    contrastWords: ['잘난 체하는', '욕심 많은', '거만한', '꾀부리는', '허세 부리는'],
  },
  {
    key: 'E',
    academicName: '정서성 (Emotionality)',
    childName: '감정과 마음의 결',
    words: ['겁이 없는', '용감한', '씩씩한', '대범한', '낙천적인', '독립적인'],
    contrastWords: ['겁이 많은', '걱정 많은', '예민한', '잘 우는', '여린', '기대고 싶은'],
  },
  {
    key: 'X',
    academicName: '외향성 (eXtraversion)',
    childName: '사람들과 어울리는 힘',
    words: ['활발한', '명랑한', '사교적인', '앞장서는', '수다스러운', '자신만만한'],
    contrastWords: ['조용한', '수줍은', '내성적인', '혼자가 편한', '말수가 적은'],
  },
  {
    key: 'A',
    academicName: '원만성 (Agreeableness)',
    childName: '사이좋게 지내는 마음',
    words: ['상냥한', '다정한', '너그러운', '잘 참는', '포용력 있는', '평화로운'],
    contrastWords: ['욱하는', '고집 센', '까칠한', '다투기 좋아하는', '냉정한'],
  },
  {
    key: 'C',
    academicName: '성실성 (Conscientiousness)',
    childName: '맡은 일을 해내는 힘',
    words: ['부지런한', '꼼꼼한', '계획적인', '책임감 있는', '끈기 있는', '정확한'],
    contrastWords: ['게으른', '덜렁대는', '충동적인', '대충하는', '산만한'],
  },
  {
    key: 'O',
    academicName: '개방성 (Openness to Experience)',
    childName: '새로움을 즐기는 마음',
    words: ['호기심 많은', '상상력이 풍부한', '창의적인', '엉뚱한', '예술을 좋아하는'],
    contrastWords: ['익숙한 걸 좋아하는', '현실적인', '변화를 싫어하는', '신중한'],
  },
];

/** 성격 낱말 전체 목록 (중복 제거) */
export const ALL_PERSONALITY_WORDS: string[] = [
  ...new Set(HEXACO_FACTORS.flatMap((f) => [...f.words, ...f.contrastWords])),
];
