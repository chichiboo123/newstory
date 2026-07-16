import { useState } from 'react';
import type { Story } from '../../types/story';
import type { RewrittenScene } from '../../types/project';
import { STAGE_LABELS, getStageByOrder } from '../../types/story';
import { STORY_GRAMMAR_PROMPTS, SENTENCE_STARTERS } from '../../data/rewrite-options';
import { getProvider, getFallbackProvider } from '../../providers/ai';
import AiModelIndicator from '../../components/AiModelIndicator';

interface Props {
  story: Story;
  rewritten: RewrittenScene[];
  onChange: (scenes: RewrittenScene[]) => void;
}

/**
 * 장면별 다시 쓰기 4단계.
 * - 전체 장면 목록에서 장면을 고르고, 원작 요약과 나란히 보며 새로 씁니다.
 * - 스타인 & 글렌의 '이야기 문법' 질문이 빈 화면 대신 생각의 발판이 됩니다.
 * - 바꾸지 않은 장면은 원작 그대로 유지됩니다.
 */
export default function SceneRewriteEditor({ story, rewritten, onChange }: Props) {
  const [index, setIndex] = useState(0);
  const [connectors, setConnectors] = useState<string[] | null>(null);
  const [loadingConn, setLoadingConn] = useState(false);

  const scene = story.scenes[index];

  function getRewrite(sceneId: string): RewrittenScene {
    return (
      rewritten.find((r) => r.sceneId === sceneId) ?? {
        sceneId,
        content: '',
        keepOriginal: true,
        newTitle: '',
      }
    );
  }

  function update(sceneId: string, patch: Partial<RewrittenScene>) {
    const current = getRewrite(sceneId);
    const next = { ...current, ...patch };
    next.keepOriginal = next.content.trim() === '' && next.newTitle.trim() === '';
    const rest = rewritten.filter((r) => r.sceneId !== sceneId);
    onChange(next.keepOriginal ? rest : [...rest, next]);
  }

  async function suggestConnectors() {
    if (loadingConn) return;
    setLoadingConn(true);
    try {
      const prev = story.scenes[index - 1];
      const next = story.scenes[index + 1];
      const req = {
        previousSummary: prev ? prev.summary : '',
        currentSummary: scene.summary,
        nextSummary: next ? next.summary : '',
        childDraft: getRewrite(scene.id).content,
      };
      let res;
      try {
        res = await getProvider().rewriteScene(req);
      } catch {
        res = await getFallbackProvider().rewriteScene(req);
      }
      setConnectors([...res.connectorSuggestions, ...res.starterSuggestions]);
    } finally {
      setLoadingConn(false);
    }
  }

  const current = getRewrite(scene.id);

  return (
    <section aria-label="장면별 다시 쓰기">
      <div className="filter-row" role="tablist" aria-label="장면 목록">
        {story.scenes.map((sc, i) => {
          const changed = rewritten.some((r) => r.sceneId === sc.id);
          return (
            <button
              key={sc.id}
              role="tab"
              aria-selected={i === index}
              className="chip"
              aria-pressed={i === index}
              onClick={() => {
                setIndex(i);
                setConnectors(null);
              }}
            >
              {changed ? '✏️ ' : ''}
              {sc.order}. {sc.title}
            </button>
          );
        })}
      </div>

      <div className="compare-grid">
        <div className="original-box">
          <h4>
            <span className="stage-badge">{STAGE_LABELS[getStageByOrder(scene.order, story.scenes.length)]}</span>원작 장면 {scene.order}. {scene.title}
          </h4>
          <p>
            <strong>장소:</strong> {scene.location}
          </p>
          <p>{scene.summary}</p>
          {scene.conflict && (
            <p>
              <strong>문제:</strong> {scene.conflict}
            </p>
          )}
          <div className="tag-row">
            {scene.editableElements.map((e) => (
              <span className="tag" key={e}>
                바꿔 볼 수 있어요: {e}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h4>내가 다시 쓰는 장면</h4>
          <div className="field">
            <label htmlFor="scene-title">장면 제목 (바꾸고 싶다면)</label>
            <input
              id="scene-title"
              type="text"
              value={current.newTitle}
              onChange={(e) => update(scene.id, { newTitle: e.target.value })}
              placeholder={scene.title}
            />
          </div>
          <div className="field">
            <label htmlFor="scene-content">새 장면 내용</label>
            <p className="hint">
              비워 두면 이 장면은 <strong>원작 그대로</strong> 남아요.
            </p>
            <textarea
              id="scene-content"
              value={current.content}
              onChange={(e) => update(scene.id, { content: e.target.value })}
              placeholder="이 장면을 나만의 이야기로 다시 써 보세요"
              style={{ minHeight: 180 }}
            />
          </div>
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--color-accent)' }}>
              🧭 장면 쓰기 도움 질문 (이야기 문법)
            </summary>
            <ul style={{ fontSize: 'var(--fs-small)' }}>
              {STORY_GRAMMAR_PROMPTS.map((p) => (
                <li key={p.label}>
                  <strong>{p.label}:</strong> {p.question}
                </li>
              ))}
            </ul>
          </details>
          <div style={{ marginTop: '0.6rem' }}>
            <div className="helper-bar">
              <button type="button" className="btn btn-secondary btn-sm" onClick={suggestConnectors} disabled={loadingConn} aria-busy={loadingConn}>
                {loadingConn ? '찾는 중…' : '🔗 앞뒤 장면 연결 문장 추천'}
              </button>
              <AiModelIndicator />
            </div>
            {connectors && (
              <div className="choice-row" style={{ marginTop: '0.5rem' }}>
                {connectors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="chip"
                    onClick={() => update(scene.id, { content: current.content ? `${current.content}\n${c}` : c })}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--color-accent)' }}>✨ 문장 시작 카드</summary>
            <div className="choice-row" style={{ marginTop: '0.5rem' }}>
              {SENTENCE_STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => update(scene.id, { content: current.content ? `${current.content}\n${s}` : s })}
                >
                  {s}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="step-nav">
        <button type="button" className="btn btn-ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← 이전 장면
        </button>
        <span className="save-status" role="status" aria-live="polite">
          ✓ 자동 저장됨
        </span>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={index === story.scenes.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          다음 장면 →
        </button>
      </div>
    </section>
  );
}
