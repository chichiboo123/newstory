# 이야기 창작 활동의 학술적 기반

「안녕, 동화」의 창작 활동 구조는 서사학과 읽기·쓰기 교육 연구에서 세계적으로 널리 인정받는 네 가지 이론에 기반한다.

## 1. 프라이타크 피라미드 — 장면 구조 이해

구스타프 프라이타크(Gustav Freytag)는 『희곡의 기법』(Die Technik des Dramas, 1863)에서 극적 서사가 **발단(Exposition) → 상승(Rising Action) → 절정(Climax) → 하강(Falling Action) → 결말(Dénouement)**의 산(피라미드) 모양을 이룬다고 정리했다.

**적용**: 30편 모든 동화의 장면(`Scene.stage`)에 5단계를 표시한다. 어린이는 '장면 살펴보기' 화면에서 이야기가 어디에서 긴장이 오르고 어디에서 풀리는지 시각적으로 확인한 뒤, 같은 구조 감각으로 자기 이야기를 쓴다.

## 2. 프로프의 민담 형태론 — 인물 역할과 사건 카드

블라디미르 프로프(Vladimir Propp)는 『민담 형태론』(Морфология сказки, 1928)에서 러시아 마법담 100편을 분석해 **31가지 서사 기능**과 **7가지 행동 영역(주인공, 악당, 조력자, 증여자, 파견자, 공주와 그 아버지, 가짜 주인공)**을 도출했다. 이는 구조주의 서사학의 출발점으로 평가된다.

**적용**:
- 등장인물 카드의 역할 배지(`proppRole`): 주인공/방해 인물/조력자/지혜를 주는 인물/길을 떠나게 하는 인물/주인공이 찾는 대상/가짜 주인공.
- '이야기 카드'(`PROPP_EVENT_CARDS`): 31가지 기능 중 어린이에게 유효한 14가지(금지, 위반, 시험, 증여, 추격, 변신, 귀환 등)를 쉬운 말로 바꿔, 글이 막힐 때 다음 사건 아이디어로 뽑아 쓸 수 있게 했다.

## 3. 캠벨의 영웅의 여정 — 줄거리 다시 쓰기 뼈대

조지프 캠벨(Joseph Campbell)은 『천의 얼굴을 가진 영웅』(The Hero with a Thousand Faces, 1949)에서 세계 신화에 공통되는 **원질신화(monomyth)** 구조 — 출발·입문·귀환 — 를 제시했다. 이 구조는 크리스토퍼 보글러 등을 통해 창작 교육의 표준 도구가 되었다.

**적용**: 줄거리 다시 쓰기(4단계)의 여섯 칸 뼈대(`HERO_JOURNEY_STEPS`)로 단순화했다.
① 평범한 하루 → ② 모험의 시작 → ③ 친구와 시련 → ④ 가장 큰 위기 → ⑤ 해결의 순간 → ⑥ 달라진 주인공.
칸은 비워 둘 수 있고 순서를 강제하지 않는다(어린이의 표현이 항상 우선).

## 4. 스타인과 글렌의 이야기 문법 — 장면 쓰기 발판

낸시 스타인(Nancy Stein)과 크리스틴 글렌(Christine Glenn)의 이야기 문법(Story Grammar, 1979)은 이야기가 **배경(Setting) → 계기 사건(Initiating Event) → 내적 반응(Internal Response) → 시도(Attempt) → 결과(Consequence) → 반응(Reaction)**의 일화(episode) 단위로 조직된다는 이론으로, 초등 읽기 이해·쓰기 지도 연구에서 광범위하게 검증되어 왔다.

**적용**: 장면별 다시 쓰기 편집기의 '장면 쓰기 도움 질문'(`STORY_GRAMMAR_PROMPTS`)으로 제공한다. 빈 화면 대신 "어떤 일이 일어나나요? → 인물은 어떤 기분이 드나요? → 무엇을 해 보나요? → 그래서 어떻게 되었나요?"의 발판을 딛고 쓴다.

## 설계 원칙과의 연결

- 이론은 **틀이 아니라 발판**이다: 모든 단계는 건너뛰거나 비워 둘 수 있고, 시스템 제안은 어린이가 선택했을 때만 반영된다.
- 도움 장치(생각 열기 질문, 문장 시작 카드, 연결 문장)는 완성된 글을 대신 써 주지 않고 **아이디어 3개 제안 → 어린이가 선택·수정**의 흐름을 지킨다.

## 참고 문헌

- Freytag, G. (1863). *Die Technik des Dramas*.
- Propp, V. (1928). *Morphology of the Folktale* (영역 1958, University of Texas Press).
- Campbell, J. (1949). *The Hero with a Thousand Faces*. Pantheon Books.
- Stein, N. L., & Glenn, C. G. (1979). An analysis of story comprehension in elementary school children. In R. O. Freedle (Ed.), *New Directions in Discourse Processing*. Ablex.
