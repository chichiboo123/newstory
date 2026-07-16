import { HERO_JOURNEY_STEPS, SENTENCE_STARTERS, THINKING_STARTERS } from '../../data/rewrite-options';
import { PLOT_ELEMENTS } from '../../data/rewrite-options';
import type { PlotElementChange } from '../../types/project';
import type { Story } from '../../types/story';
import IdeaHelper from '../../components/IdeaHelper';

interface Props {
  story: Story;
  plotChanges: PlotElementChange[];
  draft: string[];
  onChange: (draft: string[]) => void;
  projectTitle: string;
  onTitleChange: (title: string) => void;
}

/** 바꾼 설정을 바탕으로 제목 후보 3개를 규칙 기반으로 제안 */
function suggestTitles(story: Story, changes: PlotElementChange[]): string[] {
  const get = (key: string) => changes.find((c) => c.key === key)?.value;
  const hero = get('protagonist') ?? story.characters[0]?.name ?? '주인공';
  const place = get('place');
  const object = get('object');
  const suggestions = [
    place ? `${place}의 ${hero}` : `새로운 ${story.titleKo}`,
    object ? `${hero}와(과) ${object}` : `${hero}의 특별한 하루`,
    `그날, ${hero}에게 생긴 일`,
  ];
  return suggestions;
}

/**
 * 줄거리 다시 쓰기 4단계.
 * 캠벨의 '영웅의 여정'을 어린이용 6단계로 줄인 뼈대를 따라 새 줄거리를 씁니다.
 * 어린이가 쓴 글이 항상 우선이며, 제안은 선택했을 때만 반영됩니다.
 */
export default function PlotDraftEditor({ story, plotChanges, draft, onChange, projectTitle, onTitleChange }: Props) {
  const titles = suggestTitles(story, plotChanges);

  function setStep(i: number, value: string) {
    const next = [...draft];
    next[i] = value;
    onChange(next);
  }

  return (
    <section aria-label="새 줄거리 쓰기">
      <div className="card">
        <h3>📌 내가 바꾼 설정</h3>
        {plotChanges.length === 0 ? (
          <p>바꾼 설정이 없어요. 원작의 설정을 그대로 두고 나만의 문장으로 다시 써 볼 수도 있어요!</p>
        ) : (
          <ul>
            {plotChanges.map((c) => {
              const def = PLOT_ELEMENTS.find((e) => e.key === c.key);
              return (
                <li key={c.key}>
                  <strong>{def?.label}:</strong> {c.value}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="card">
        <div className="field">
          <label htmlFor="project-title">새 이야기 제목</label>
          <input
            id="project-title"
            type="text"
            value={projectTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="새 이야기의 제목을 지어 주세요"
          />
          <p className="hint" style={{ marginTop: '0.4rem' }}>
            제목 후보가 필요하면 골라 보세요:
          </p>
          <div className="choice-row">
            {titles.map((t) => (
              <button key={t} type="button" className="chip" onClick={() => onTitleChange(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="notice">
        아래 6단계는 세계의 많은 이야기가 따르는 <strong>영웅의 여정</strong> 지도예요. 순서대로
        쓰지 않아도 되고, 칸을 비워 두어도 괜찮아요.
      </p>

      {HERO_JOURNEY_STEPS.map((step, i) => (
        <div className="card" key={step.title}>
          <h3>{step.title}</h3>
          <p className="hint">{step.guide}</p>
          <div className="field">
            <label htmlFor={`journey-${i}`} className="sr-only">
              {step.title} 내용 쓰기
            </label>
            <textarea
              id={`journey-${i}`}
              value={draft[i] ?? ''}
              onChange={(e) => setStep(i, e.target.value)}
              placeholder={step.placeholder}
            />
          </div>
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--color-accent)' }}>
              ✍️ 막힐 때 도움 카드 보기
            </summary>
            <p className="hint" style={{ marginTop: '0.5rem' }}>
              문장 시작 카드 (누르면 글 뒤에 붙어요):
            </p>
            <div className="choice-row">
              {SENTENCE_STARTERS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => setStep(i, draft[i] ? `${draft[i]}\n${s}` : s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="hint" style={{ marginTop: '0.5rem' }}>
              생각 열기 질문: {THINKING_STARTERS[i % THINKING_STARTERS.length]}
            </p>
            <IdeaHelper topic="next-event" context={story.titleKo} label="🃏 다음 사건 카드 뽑기" onPick={(t) => setStep(i, draft[i] ? `${draft[i]}\n(${t})` : `(${t})`)} />
          </details>
        </div>
      ))}
    </section>
  );
}
