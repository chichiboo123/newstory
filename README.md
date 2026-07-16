# 📖 안녕, 동화 (Hello, Story)

어린이가 저작권 걱정 없는 **세계의 고전 동화 30편**을 탐색하고, 등장인물과 사건을 바꾸어 **자신만의 새로운 이야기로 각색**하는 교육용 웹앱입니다. 초등학생이 혼자서도 쓸 수 있고, 교사가 국어(이야기 바꾸어 쓰기) 수업에서도 활용할 수 있도록 설계했습니다.

- **배포 주소**: `https://<GitHub아이디>.github.io/newstory/` (아래 배포 방법 참고)
- **로그인 불필요 · 개인정보 미수집** — 모든 작업물은 사용자의 브라우저(localStorage)에만 저장됩니다.

---

## ✨ 주요 기능

| 단계 | 기능 |
| --- | --- |
| 1. 동화 고르기 | 마법 도서관 서가, 검색, 주제·지역·연령·길이 필터, 무작위 추천 |
| 2. 동화 살펴보기 | 자체 작성 줄거리, 등장인물 카드, 장면 구조(발단~결말), 생각해 볼 질문, 출처·저작권 검토 정보 |
| 3. 바꿀 부분 고르기 | 15가지 이야기 요소(주인공·배경·결말 등) 선택, 등장인물 설정 바꾸기 |
| 4. 다시 쓰기 | **줄거리 다시 쓰기**(영웅의 여정 6단계) / **장면별 다시 쓰기**(원작과 나란히 비교) |
| 5. 완성하기 | 디지털 동화책 미리 보기, 작가의 말, 이야기 점검, JSON 저장·불러오기, 인쇄/PDF, 텍스트 복사 |

빈 화면에서 시작하지 않도록 **생각 열기 질문, 문장 시작 카드, 이야기 카드(다음 사건 제안), 장면 연결 문장 추천**을 제공합니다. 모든 도움 기능은 **인터넷 AI 없이** 동작합니다.

## 📚 이야기 창작 활동의 학술적 기반

창작 활동의 데이터와 정리 방식은 **2022 개정 교육과정 국어과 지도서**와 서사학·성격심리학·읽기교육의 확실한 근거에 기반합니다.

| 근거 | 적용된 곳 |
| --- | --- |
| **2022 개정 교육과정 국어과 4학년 지도서** — 이야기의 구성 단계 (출처: 김대조·김민중(2013), 『생각을 키우는 시와 동화 쓰기』, 꿈과희망) | 모든 동화의 장면에 **발단→전개→위기→절정→결말** 단계 표시. 5개 장면이 순서대로 5단계에 대응 |
| **HEXACO 성격 모델** — 3학년 지도서 '성격을 나타내는 말' (출처: 유태용·이기범·Ashton(2004), 한국판 HEXACO 검사 구성 타당화, 한국심리학회지) | 인물 바꾸기의 '성격' 항목에 6요인별 '성격 낱말 카드' 제공(정직성-겸손성·정서성·외향성·원만성·성실성·개방성) |
| **블라디미르 프로프**, 『민담 형태론』(1928) — 인물 기능과 역할 | 등장인물 카드의 역할 배지(주인공·방해 인물·조력자·증여자 등), 막힐 때 뽑는 '이야기 카드' |
| **조지프 캠벨**, 『천의 얼굴을 가진 영웅』(1949) — 영웅의 여정 | 줄거리 다시 쓰기의 6단계 뼈대(평범한 하루→모험의 시작→친구와 시련→가장 큰 위기→해결→달라진 주인공) |
| **스타인 & 글렌**(1979) — 이야기 문법(Story Grammar) | 장면별 다시 쓰기의 안내 질문(배경→계기 사건→마음속 반응→시도→결과→마무리) |

자세한 설명은 [docs/story-theory.md](docs/story-theory.md)를 참고하세요.

## 🛠 사용 기술

- **React 18 + TypeScript + Vite 5** — SPA 프레임워크와 빌드
- **react-router-dom (HashRouter)** — GitHub Pages에서 새로고침 404가 나지 않는 해시 라우팅
- **Pretendard GOV** — 전체 화면 공통 폰트 (jsDelivr CDN)
- **localStorage** — 로그인 없는 자동 저장
- **ESLint + typescript-eslint** — 코드 품질 검사
- **GitHub Actions + GitHub Pages** — 자동 배포

상태 관리 라이브러리는 사용하지 않습니다(요구 범위에서 React 내장 상태로 충분).

## 🚀 로컬 실행 방법

```bash
# Node.js 20 이상 권장 (개발은 22에서 진행)
npm install
npm run dev        # http://localhost:5173
npm run build      # 타입 검사 + 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 미리 보기
npm run lint       # ESLint 검사
```

## 🌐 GitHub Pages 배포 방법

1. 이 저장소를 GitHub에 푸시합니다.
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
3. `main` 브랜치에 푸시하면 `.github/workflows/deploy.yml`이 자동으로 빌드·배포합니다.
   (Actions 탭에서 **Deploy to GitHub Pages** 워크플로를 수동 실행할 수도 있습니다.)
4. 배포가 끝나면 `https://<GitHub아이디>.github.io/newstory/`에서 접속할 수 있습니다.

### 저장소 이름을 바꾸면?

GitHub Pages는 `https://<아이디>.github.io/<저장소이름>/` 하위 경로에 배포되므로 Vite의 `base`가 저장소 이름과 일치해야 합니다.

- **배포 워크플로는 자동 대응**: `deploy.yml`이 `VITE_BASE=/<저장소이름>/`을 자동 주입하므로 이름을 바꿔도 그대로 동작합니다.
- 로컬에서 프로덕션 빌드를 직접 만들 때는 `vite.config.ts`의 기본값(`/newstory/`)을 바꾸거나 `VITE_BASE=/새이름/ npm run build`로 빌드하세요.

### 새로고침 404가 없는 이유

`HashRouter`를 사용해 모든 경로가 `…/#/story/xyz` 형태이므로, 어떤 화면에서 새로고침해도 GitHub Pages는 항상 `index.html`을 반환합니다. 별도의 404 우회 설정이 필요 없습니다.

## 🔐 AI 기능 (Gemini) 연결과 보안

AI 도우미는 **Google Gemini**로 동작하며, 키는 **사이트에 입력하지 않고 GitHub Actions Secret으로 빌드 시 주입**합니다.

### 연결 방법 (관리자·교사)

1. [Google AI Studio](https://aistudio.google.com/)에서 **전용** Gemini API 키를 발급합니다.
2. 저장소 **Settings → Secrets and variables → Actions**에서:
   - **Secret** `GEMINI_API_KEY` 추가 (필수)
   - **Variable** `VITE_GEMINI_MODEL` 추가 (선택, 기본값 `gemini-2.5-flash`)
3. `main`에 커밋하거나 Actions에서 워크플로를 재실행하면 다음 배포부터 AI가 켜집니다.
4. 키가 없으면 앱은 자동으로 **규칙 기반 도우미**로 동작합니다(핵심 기능 모두 정상).

### ⚠️ 보안: 정적 배포에서 키가 노출될 수 있는 이유와 대응

GitHub Pages는 **정적 호스팅**이라, 빌드 결과물(JS)에 포함된 `VITE_` 값은 브라우저에서 확인될 수 있습니다. 따라서 Gemini 키를 쓸 때는 **반드시**:

- **전용 키**를 사용합니다(다른 서비스와 공유 금지).
- Google AI Studio(또는 Google Cloud)에서 **HTTP 리퍼러 제한**을 배포 도메인(`https://<아이디>.github.io/*`)으로 설정합니다.
- **사용량 상한(quota)** 을 설정해 오남용 시 비용·피해를 제한합니다.
- 저장소가 공개라면 위 제한이 특히 중요합니다.

### AI를 효과적으로 쓰기 위한 설계 (호출 순서)

1. 필요한 **요약만 최소로** 구성(전체 원문 미전송) → 2. **캐시** 확인 → 3. 진행 중 **중복요청 잠금** → 4. Gemini 호출(**구조화 JSON** 응답 스키마) → 5. 실패 시 **백오프 재시도** → 6. 그래도 실패하면 **규칙 기반(Local)으로 자동 대체** → 7. 결과 **캐시 저장**. 호출은 버튼을 눌렀을 때만 일어나고, 어린이가 쓴 내용은 오류가 나도 사라지지 않습니다.

### AI 제공자 교체 방법

`src/providers/ai/`의 `AIProvider` 인터페이스(`generateIdeas`, `rewriteScene`, `reviewConsistency`)를 구현하면 됩니다.

- `GeminiProvider` — 기본 AI. 빌드에 키가 주입되면 활성화
- `LocalRuleProvider` — 키가 없을 때의 규칙 기반 도우미(네트워크 불필요)
- `MockAIProvider` — 개발·테스트용 고정 응답

다른 AI로 바꾸려면 같은 인터페이스로 새 Provider를 만들고 `src/providers/ai/index.ts`의 `getProvider()`에 연결하면 됩니다.

## 📖 동화 데이터 추가 방법

1. `src/data/stories/` 안의 JSON 파일(출처별 분류)에 `Story` 형식(`src/types/story.ts`)으로 작품을 추가합니다.
2. 새 파일을 만들었다면 `src/data/stories/index.ts`에 import를 추가합니다.
3. **저작권 원칙(필수)** — 자세한 검토 기준은 [docs/copyright-review.md](docs/copyright-review.md) 참고:
   - 원전이 퍼블릭 도메인인지 확인하고, 불확실하면 **포함하지 않습니다**.
   - 현대 번역가·작가의 문장을 복사하지 않고 **원전의 사실관계만 참고해 새로 요약**합니다.
   - 디즈니 등 현대 영화·애니메이션의 고유 설정(이름, 노래, 캐릭터 디자인)을 쓰지 않습니다.
   - `sourceInfo`에 출처, 퍼블릭 도메인 검토 메모, 주의할 현대 각색 요소, 검토 날짜를 기록합니다.
   - 표지는 기존 책 표지 대신 이모지+그라디언트 조합(`coverVisual`)으로 만듭니다.
4. 잔혹한 원전 내용은 어린이 발달 수준에 맞게 완화하되, 원작의 핵심 의미를 왜곡하지 않습니다(완화 내용은 `publicDomainNote`에 기록).

## 📂 폴더 구조

```
newstory/
├─ .github/workflows/deploy.yml   # GitHub Pages 자동 배포
├─ index.html                     # Pretendard GOV 폰트 로드
├─ src/
│  ├─ app/App.tsx                 # HashRouter 라우팅
│  ├─ components/                 # 공용 UI (StepBar, StoryCard, IdeaHelper 등)
│  ├─ features/
│  │  ├─ library/                 # 1단계: 동화 도서관
│  │  ├─ story-reader/            # 2단계: 동화 살펴보기
│  │  ├─ rewrite/                 # 3~4단계: 요소·인물·줄거리·장면 편집기
│  │  ├─ story-preview/           # 5단계: 완성 동화책·내보내기
│  │  ├─ my-stories/              # 내가 쓴 이야기 목록·가져오기
│  │  └─ settings/                # AI 프록시 설정
│  ├─ data/
│  │  ├─ stories/                 # 동화 30편 JSON (출처별)
│  │  └─ rewrite-options.ts       # 이론 기반 창작 카드·질문 데이터
│  ├─ providers/ai/               # AI 제공자 추상화 (Local/Remote/Mock)
│  ├─ types/                      # Story·Project 타입
│  ├─ utils/storage.ts            # localStorage 저장/내보내기/가져오기
│  └─ styles/global.css           # 디자인 토큰·반응형·인쇄 스타일
└─ docs/                          # 저작권 검토, 창작 이론, 테스트 체크리스트
```

## ♿ 접근성과 어린이 안전 (KRDS · KWCAG 기반)

디지털 정부 서비스 UI/UX 가이드라인(KRDS)과 한국형 웹 콘텐츠 접근성 지침(KWCAG)의 원칙을 적용했습니다.

- **본문 바로가기** 스킵 링크 제공(키보드 사용자가 메뉴를 건너뛰고 본문으로 이동)
- 명도 대비 AA 충족(본문 4.5:1, 큰 텍스트·UI 3:1 이상)으로 색 토큰 조정
- 키보드 탐색과 명확한 포커스 링(`:focus-visible`), 스크린 리더용 레이블 제공
- 화면마다 고유한 문서 제목(예: "동화 도서관 · 안녕, 동화")
- 색상만으로 상태를 구분하지 않음(체크 표시·텍스트 병행), 44px 이상 터치 영역
- `prefers-reduced-motion` 존중, 큰 본문 글자(17px)와 넉넉한 줄 간격, Pretendard GOV 적용
- 라우트 이동 시 화면 상단으로 이동, 모든 입력은 즉시 자동 저장(작성 내용 보존)
- 실명·학교명·연락처를 요구하지 않고 별명 사용을 안내

## ⚠️ 알려진 제한 사항

- 저장은 브라우저 localStorage 기반이므로 브라우저 데이터를 지우면 작업물이 사라집니다. (JSON 내보내기로 백업 권장)
- 여러 기기 간 동기화는 지원하지 않습니다. JSON 파일로 옮겨 주세요.
- 내장 창작 도우미는 규칙 기반이므로 문장 생성·다듬기 같은 생성형 기능은 프록시 연결 시에만 제공됩니다.
- 동화 표지는 이모지 기반 자체 썸네일이며 삽화는 제공하지 않습니다(확장 예정 항목).

## 🗺 향후 개선 목록

- 이야기 표지 꾸미기(색·이모지 편집), 장면별 자체 삽화
- 교사용 활동 안내서, 발표 모드, 학급 공유 코드
- 등장인물 관계도·이야기 흐름 지도 시각화
- 다국어 지원, IndexedDB 이전(대용량 프로젝트)

## 🙏 Thanks to (오픈소스)

이 프로젝트는 훌륭한 오픈소스 덕분에 만들어졌습니다.

- [React](https://react.dev/) (MIT) — UI 라이브러리
- [Vite](https://vitejs.dev/) (MIT) — 빌드 도구
- [TypeScript](https://www.typescriptlang.org/) (Apache-2.0) — 타입 시스템
- [React Router](https://reactrouter.com/) (MIT) — 라우팅
- [Pretendard / Pretendard GOV](https://github.com/orioncactus/pretendard) (SIL OFL 1.1) — 길형진(orioncactus) 님의 한글 글꼴
- [ESLint](https://eslint.org/) (MIT) · [typescript-eslint](https://typescript-eslint.io/) (MIT) — 코드 품질
- [jsDelivr](https://www.jsdelivr.com/) — 폰트 CDN
- GitHub Actions의 [actions/checkout](https://github.com/actions/checkout), [actions/setup-node](https://github.com/actions/setup-node), [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact), [actions/deploy-pages](https://github.com/actions/deploy-pages) (MIT)

그리고 이 앱의 뼈대가 된 이야기들 — 이솝, 그림 형제, 안데르센, 페로, 콜로디, 바움, 그리고 이름이 전해지지 않는 세계의 옛이야기꾼들에게 감사드립니다.

## 📄 라이선스

- 소스 코드: [MIT License](LICENSE)
- 동화 요약·장면 설명·창작 카드 텍스트: 퍼블릭 도메인 원전을 바탕으로 본 프로젝트에서 자체 작성했으며, 코드와 동일하게 MIT로 배포합니다.
