import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadProjects, deleteProject, importProject, exportProject } from '../../utils/storage';
import { getStoryById } from '../../data/stories';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

/** 내가 다시 쓴 동화 목록 + JSON 불러오기 */
export default function MyStoriesPage() {
  useDocumentTitle('내가 쓴 이야기');
  const [projects, setProjects] = useState(loadProjects());
  const [message, setMessage] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function refresh() {
    setProjects(loadProjects());
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text();
      const project = importProject(text);
      setMessage(`「${project.projectTitle || '제목 없는 이야기'}」를 불러왔어요! 🎉`);
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '파일을 읽지 못했어요. 다른 파일로 다시 시도해 주세요.');
    }
  }

  function remove(id: string) {
    deleteProject(id);
    setConfirmingId(null);
    refresh();
  }

  return (
    <>
      <h1>✏️ 내가 쓴 이야기</h1>
      <div className="card no-print">
        <p className="hint" style={{ marginBottom: '0.5rem' }}>
          다른 컴퓨터에서 저장한 이야기 파일(.json)을 불러올 수 있어요.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImport(f);
            e.target.value = '';
          }}
        />
        <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
          📂 이야기 파일 불러오기
        </button>
        {message && (
          <p role="status" style={{ marginTop: '0.5rem' }}>
            {message}
          </p>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <p>아직 쓴 이야기가 없어요. 도서관에서 마음에 드는 동화를 골라 시작해 보세요!</p>
          <Link className="btn btn-primary" to="/">
            📖 동화 고르러 가기
          </Link>
        </div>
      ) : (
        <div className="story-grid">
          {projects.map((p) => {
            const story = getStoryById(p.sourceStoryId);
            return (
              <div className="card" key={p.id}>
                <h3>{p.projectTitle || `새로 쓴 ${story?.titleKo ?? '이야기'}`}</h3>
                <p className="story-card-meta">
                  원작: {story?.titleKo ?? '?'} · {p.mode === 'plot' ? '줄거리 다시 쓰기' : '장면별 다시 쓰기'}
                </p>
                <p className="story-card-meta">
                  마지막 수정: {new Date(p.updatedAt).toLocaleDateString('ko-KR')}
                  {p.creatorNickname && ` · 글: ${p.creatorNickname}`}
                </p>
                <div className="card-actions">
                  <Link className="btn btn-primary btn-sm" to={`/project/${p.id}`}>
                    이어서 쓰기
                  </Link>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportProject(p)}>
                    파일로 저장
                  </button>
                  {confirmingId === p.id ? (
                    <>
                      <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => remove(p.id)}>
                        정말 지울래요
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmingId(null)}>
                        취소
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmingId(p.id)}>
                      지우기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
