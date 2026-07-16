import { getProvider, isAIEnabled } from '../../providers/ai';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

/** 설정: AI 도우미 상태 안내 (연결 방식은 GitHub 환경변수로 고정) */
export default function SettingsPage() {
  useDocumentTitle('설정');
  const aiOn = isAIEnabled();
  const provider = getProvider();

  return (
    <>
      <h1>⚙️ 설정</h1>

      <div className="card">
        <h2>창작 도우미 상태</h2>
        <p>
          지금 사용 중인 도우미:{' '}
          <strong>{provider.name}</strong>
        </p>
        <p className="notice" style={aiOn ? undefined : { background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)' }}>
          {aiOn ? (
            <>✨ Gemini AI 도우미가 켜져 있어요. 아이디어·문장 연결·이야기 점검을 도와줘요.</>
          ) : (
            <>
              지금은 <strong>인터넷 없이 동작하는 낱말·문장 카드 도우미</strong>로 작동해요. 모든 핵심
              기능은 그대로 쓸 수 있어요. (Gemini AI는 관리자가 연결하면 켜집니다.)
            </>
          )}
        </p>
      </div>

      <div className="card">
        <h2>관리자·교사용: AI 연결 방법</h2>
        <p className="hint">
          이 앱의 AI 키는 <strong>사이트에 입력하지 않습니다</strong>. 대신 GitHub 저장소의{' '}
          <strong>Actions Secret</strong>에 넣으면 배포 때 안전하게 연결돼요.
        </p>
        <ol>
          <li>Google AI Studio에서 Gemini API 키를 발급받아요.</li>
          <li>
            저장소 <strong>Settings → Secrets and variables → Actions</strong>에서{' '}
            <code>GEMINI_API_KEY</code> 시크릿을 추가해요. (모델 순서를 바꾸려면{' '}
            <code>VITE_GEMINI_MODELS</code> 변수도 추가 — 쉼표로 구분)
          </li>
          <li>
            <strong>main</strong> 브랜치에 커밋을 올리면(또는 Actions에서 재실행) 다음 배포부터 AI가
            켜져요.
          </li>
        </ol>
        <p className="notice warn">
          ⚠️ GitHub Pages는 정적 사이트라 배포 파일에 담긴 키는 브라우저에서 확인될 수 있어요.
          반드시 <strong>전용 키</strong>를 쓰고, Google AI Studio에서 <strong>HTTP 리퍼러 제한</strong>과{' '}
          <strong>사용량 상한</strong>을 설정하세요.
        </p>
      </div>

      <div className="card">
        <h2>개인정보 보호 약속</h2>
        <ul>
          <li>로그인이 없어요. 모든 이야기는 이 브라우저에만 저장돼요.</li>
          <li>실명, 학교 이름, 연락처를 묻지 않아요. 별명만 사용해요.</li>
          <li>AI를 쓸 때도 필요한 최소한의 요약만 전송하고, 같은 요청은 다시 부르지 않도록 저장해요.</li>
        </ul>
      </div>
    </>
  );
}
