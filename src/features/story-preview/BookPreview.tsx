import type { RewriteProject } from '../../types/project';
import type { Story } from '../../types/story';
import { HERO_JOURNEY_STEPS, PLOT_ELEMENTS } from '../../data/rewrite-options';

interface Props {
  project: RewriteProject;
  story: Story;
}

/** 완성된 이야기를 디지털 동화책 형태로 보여 줍니다. 인쇄(PDF 저장)에도 사용됩니다. */
export default function BookPreview({ project, story }: Props) {
  const [c1, c2] = story.coverVisual.colors;
  const title = project.projectTitle || `새로 쓴 ${story.titleKo}`;

  const changedCharacters = project.characterChanges.filter((c) =>
    Object.entries(c).some(([k, v]) => k !== 'characterId' && v.trim() !== ''),
  );

  return (
    <article className="book-preview" aria-label="완성된 동화책 미리 보기">
      <div className="book-cover-page" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
        <div style={{ fontSize: '4rem' }} aria-hidden="true">
          {story.coverVisual.emoji}
        </div>
        <h1 style={{ color: 'var(--color-text)' }}>{title}</h1>
        <p style={{ color: 'var(--color-text)', fontWeight: 700 }}>
          {project.creatorNickname ? `글: ${project.creatorNickname}` : '나만의 이야기'}
        </p>
        <p style={{ color: 'var(--color-text-sub)', fontSize: 'var(--fs-small)' }}>
          원작: 『{story.titleKo}』 ({story.authorOrOrigin})
        </p>
      </div>

      {changedCharacters.length > 0 && (
        <section className="book-page">
          <h2>새 등장인물 소개</h2>
          {changedCharacters.map((c) => {
            const original = story.characters.find((sc) => sc.id === c.characterId);
            return (
              <p key={c.characterId}>
                <strong>{c.name || original?.name}</strong>
                {original && c.name && ` (원작의 ${original.name})`} —{' '}
                {[c.personality, c.roleOrJob, c.ability, c.goal].filter(Boolean).join(', ') || '설정을 새로 바꾼 인물'}
              </p>
            );
          })}
        </section>
      )}

      {project.mode === 'plot' ? (
        project.plotDraft.map((text, i) =>
          text.trim() ? (
            <section className="book-page" key={i}>
              <h2>{HERO_JOURNEY_STEPS[i]?.title ?? `장면 ${i + 1}`}</h2>
              <p className="book-page-body">{text}</p>
            </section>
          ) : null,
        )
      ) : (
        story.scenes.map((scene) => {
          const rw = project.rewrittenScenes.find((r) => r.sceneId === scene.id);
          return (
            <section className="book-page" key={scene.id}>
              <h2>
                {scene.order}. {rw?.newTitle || scene.title}
                {rw && !rw.keepOriginal && ' ✏️'}
              </h2>
              <p className="book-page-body">{rw && rw.content.trim() ? rw.content : scene.summary}</p>
            </section>
          );
        })
      )}

      {project.plotChanges.length > 0 && (
        <section className="book-page">
          <h2>원작에서 바꾼 점</h2>
          <ul>
            {project.plotChanges.map((c) => {
              const def = PLOT_ELEMENTS.find((e) => e.key === c.key);
              return (
                <li key={c.key}>
                  {def?.label}: {c.value}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(project.reflection.whatChanged || project.reflection.favoriteScene || project.reflection.message) && (
        <section className="book-page">
          <h2>작가의 말</h2>
          {project.reflection.whatChanged && (
            <p>
              <strong>내가 바꾼 것:</strong> {project.reflection.whatChanged}
            </p>
          )}
          {project.reflection.favoriteScene && (
            <p>
              <strong>가장 마음에 드는 장면:</strong> {project.reflection.favoriteScene}
            </p>
          )}
          {project.reflection.message && (
            <p>
              <strong>이야기에 담고 싶은 생각:</strong> {project.reflection.message}
            </p>
          )}
        </section>
      )}

      <section className="book-page" style={{ color: 'var(--color-text-sub)', fontSize: 'var(--fs-small)' }}>
        <p>
          마지막으로 고친 날: {new Date(project.updatedAt).toLocaleDateString('ko-KR')} · 「안녕,
          동화」에서 만든 이야기예요.
        </p>
      </section>
    </article>
  );
}
