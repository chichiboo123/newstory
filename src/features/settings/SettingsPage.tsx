import { useState } from 'react';
import { getSavedEndpoint, saveEndpoint, getProvider } from '../../providers/ai';

/** 설정: AI 도우미 상태 표시 및 (교사용) 프록시 엔드포인트 등록 */
export default function SettingsPage() {
  const [endpoint, setEndpoint] = useState(getSavedEndpoint());
  const [saved, setSaved] = useState(false);
  const provider = getProvider();

  function save() {
    saveEndpoint(endpoint);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <h1>⚙️ 설정</h1>

      <div className="card">
        <h2>창작 도우미 상태</h2>
        <p>
          지금 사용 중인 도우미: <strong>{provider.name}</strong>
        </p>
        <p className="notice">
          「안녕, 동화」는 인터넷 AI 없이도 모든 핵심 기능이 동작해요. 아이디어 카드, 문장 시작
          카드, 이야기 점검은 모두 이 앱 안에 들어 있는 규칙으로 작동한답니다.
        </p>
      </div>

      <div className="card">
        <h2>교사·운영자용: 안전한 AI 서버 연결 (선택)</h2>
        <p className="hint">
          이 앱은 GitHub Pages(정적 호스팅)에 배포되어 <strong>비밀 API 키를 안전하게 숨길 수
          없습니다</strong>. 그래서 API 키를 앱에 넣는 대신, 교사나 기관이 별도로 운영하는{' '}
          <strong>프록시 서버 주소(https)</strong>만 등록할 수 있게 했어요. 키는 그 서버에만
          보관하세요. 자세한 방법은 README를 참고해 주세요.
        </p>
        <div className="field">
          <label htmlFor="endpoint">프록시 서버 주소 (비워 두면 내장 도우미 사용)</label>
          <input
            id="endpoint"
            type="text"
            inputMode="url"
            placeholder="https://example-school-proxy.example.com/api"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </div>
        {endpoint && !/^https:\/\//.test(endpoint.trim()) && (
          <p className="notice warn">주소는 https:// 로 시작해야 해요.</p>
        )}
        <button type="button" className="btn btn-primary" onClick={save}>
          {saved ? '✓ 저장했어요' : '저장하기'}
        </button>
      </div>

      <div className="card">
        <h2>개인정보 보호 약속</h2>
        <ul>
          <li>로그인이 없고, 서버로 글을 보내지 않아요. 모든 이야기는 이 브라우저에만 저장돼요.</li>
          <li>실명, 학교 이름, 연락처를 묻지 않아요. 별명만 사용해요.</li>
          <li>외부 AI 서버를 연결한 경우에도 필요한 최소한의 요약만 전송돼요.</li>
        </ul>
      </div>
    </>
  );
}
