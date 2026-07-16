import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getStoryById } from '../../data/stories';
import StepBar from '../../components/StepBar';
import { createProject, upsertProject } from '../../utils/storage';
import type { RewriteMode } from '../../types/project';

/** 다시 쓰기 방식 선택 + 별명/제목 입력 후 프로젝트 생성 */
export default function NewProjectPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const story = getStoryById(storyId ?? '');
  const [mode, setMode] = useState<RewriteMode>('plot');
  const [nickname, setNickname] = useState('');

  if (!story) {
    return (
      <div className="card">
        <p>동화를 찾을 수 없어요. 🥲</p>
        <Link className="btn btn-primary" to="/">
          도서관으로 돌아가기
        </Link>
      </div>
    );
  }

  function start() {
    if (!story) return;
    const project = createProject(story.id, mode);
    project.creatorNickname = nickname.trim();
    upsertProject(project);
    navigate(`/project/${project.id}`);
  }

  return (
    <>
      <StepBar current={3} />
      <h1>『{story.titleKo}』 다시 쓰기</h1>
      <div className="card">
        <div className="field">
          <label htmlFor="nickname">작가 별명</label>
          <p className="hint">실명 대신 별명을 써 주세요. (예: 반짝여우, 이야기대장) 비워 두어도 괜찮아요.</p>
          <input
            id="nickname"
            type="text"
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="별명을 입력하세요"
          />
        </div>

        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 800, marginBottom: '0.5rem' }}>어떻게 다시 써 볼까요?</legend>
          <div className="compare-grid">
            <button
              type="button"
              className="card"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                borderColor: mode === 'plot' ? 'var(--color-primary)' : undefined,
                borderWidth: 2,
              }}
              aria-pressed={mode === 'plot'}
              onClick={() => setMode('plot')}
            >
              <h3>🗺️ 줄거리 다시 쓰기 {mode === 'plot' && '✔'}</h3>
              <p>
                주인공, 배경, 결말 같은 <strong>핵심 설정을 바꾸고</strong>, 이야기 전체를 새로운
                줄거리로 만들어요. 영웅의 여정 6단계를 따라 차근차근 써요.
              </p>
            </button>
            <button
              type="button"
              className="card"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                borderColor: mode === 'scene' ? 'var(--color-primary)' : undefined,
                borderWidth: 2,
              }}
              aria-pressed={mode === 'scene'}
              onClick={() => setMode('scene')}
            >
              <h3>🎬 장면별 다시 쓰기 {mode === 'scene' && '✔'}</h3>
              <p>
                원작의 장면을 하나씩 살펴보며 <strong>바꾸고 싶은 장면만</strong> 새로 써요. 나머지
                장면은 원작 그대로 둘 수 있어요.
              </p>
            </button>
          </div>
        </fieldset>

        <div className="step-nav">
          <Link className="btn btn-ghost" to={`/story/${story.id}`}>
            ← 동화 다시 보기
          </Link>
          <button type="button" className="btn btn-primary" onClick={start}>
            창작 시작하기 →
          </button>
        </div>
      </div>
    </>
  );
}
