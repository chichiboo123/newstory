import { useState } from 'react';
import type { RewriteProject } from '../../types/project';
import type { Story } from '../../types/story';
import BookPreview from './BookPreview';
import { exportProject } from '../../utils/storage';
import { getProvider, getFallbackProvider } from '../../providers/ai';
import { HERO_JOURNEY_STEPS } from '../../data/rewrite-options';
import AiModelIndicator from '../../components/AiModelIndicator';

interface Props {
  project: RewriteProject;
  story: Story;
  onProjectChange: (patch: Partial<RewriteProject>) => void;
}

/** 5단계: 완성하기 — 작가의 말, 이야기 점검, 미리 보기, 내보내기/인쇄 */
export default function FinishStep({ project, story, onProjectChange }: Props) {
  const [review, setReview] = useState<string[] | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runReview() {
    if (reviewing) return;
    setReviewing(true);
    try {
      const names = [
        ...story.characters.map((c) => c.name),
        ...project.characterChanges.map((c) => c.name).filter(Boolean),
      ];
      const texts =
        project.mode === 'plot'
          ? project.plotDraft
          : story.scenes.map((s) => project.rewrittenScenes.find((r) => r.sceneId === s.id)?.content ?? '');
      const req = { characterNames: names, sceneTexts: texts };
      let res;
      try {
        res = await getProvider().reviewConsistency(req);
      } catch {
        res = await getFallbackProvider().reviewConsistency(req);
      }
      const stepName = (i: number) =>
        project.mode === 'plot' ? HERO_JOURNEY_STEPS[i]?.title ?? `${i + 1}번째` : `${i + 1}번 장면`;
      setReview([res.praise, ...res.issues.map((iss) => `[${stepName(iss.sceneIndex)}] ${iss.message}`)]);
    } finally {
      setReviewing(false);
    }
  }

  function copyText() {
    const parts: string[] = [project.projectTitle || `새로 쓴 ${story.titleKo}`];
    if (project.mode === 'plot') {
      project.plotDraft.forEach((t, i) => {
        if (t.trim()) parts.push(`\n${HERO_JOURNEY_STEPS[i]?.title}\n${t}`);
      });
    } else {
      story.scenes.forEach((sc) => {
        const rw = project.rewrittenScenes.find((r) => r.sceneId === sc.id);
        parts.push(`\n${sc.order}. ${rw?.newTitle || sc.title}\n${rw?.content.trim() ? rw.content : sc.summary}`);
      });
    }
    navigator.clipboard?.writeText(parts.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section aria-label="이야기 완성하기">
      <div className="card no-print">
        <h3>📝 작가의 말</h3>
        <div className="field">
          <label htmlFor="what-changed">원작에서 무엇을 바꾸었나요?</label>
          <textarea
            id="what-changed"
            value={project.reflection.whatChanged}
            onChange={(e) => onProjectChange({ reflection: { ...project.reflection, whatChanged: e.target.value } })}
            style={{ minHeight: 80 }}
          />
        </div>
        <div className="field">
          <label htmlFor="favorite-scene">가장 마음에 드는 장면은 무엇인가요?</label>
          <textarea
            id="favorite-scene"
            value={project.reflection.favoriteScene}
            onChange={(e) => onProjectChange({ reflection: { ...project.reflection, favoriteScene: e.target.value } })}
            style={{ minHeight: 80 }}
          />
        </div>
        <div className="field">
          <label htmlFor="message">이야기에 담고 싶은 생각이 있나요?</label>
          <textarea
            id="message"
            value={project.reflection.message}
            onChange={(e) => onProjectChange({ reflection: { ...project.reflection, message: e.target.value } })}
            style={{ minHeight: 80 }}
          />
        </div>
      </div>

      <div className="card no-print">
        <h3>🔍 이야기 점검하기</h3>
        <p className="hint">등장인물과 흐름이 잘 이어지는지 가볍게 살펴봐 드려요. 고칠지 말지는 작가인 여러분이 정해요!</p>
        <div className="helper-bar">
          <button type="button" className="btn btn-secondary btn-sm" onClick={runReview} disabled={reviewing} aria-busy={reviewing}>
            {reviewing ? '살펴보는 중…' : '이야기 점검하기'}
          </button>
          <AiModelIndicator />
        </div>
        {review && (
          <ul style={{ marginTop: '0.6rem' }}>
            {review.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="card no-print">
        <h3>💾 저장하고 나누기</h3>
        <p className="hint">
          이야기는 이 브라우저에 자동 저장돼요. 다른 컴퓨터로 옮기려면 파일로 저장했다가 <strong>내가 쓴
          이야기</strong> 화면에서 불러오세요.
        </p>
        <div className="choice-row">
          <button type="button" className="btn btn-primary" onClick={() => exportProject(project)}>
            📁 파일로 저장 (JSON)
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
            🖨️ 인쇄 / PDF로 저장
          </button>
          <button type="button" className="btn btn-ghost" onClick={copyText}>
            {copied ? '✓ 복사했어요!' : '📋 글 전체 복사'}
          </button>
        </div>
      </div>

      <h3 className="no-print" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        📚 완성된 동화책
      </h3>
      <BookPreview project={project} story={story} />
    </section>
  );
}
