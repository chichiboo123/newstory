import { PLOT_ELEMENTS } from '../../data/rewrite-options';
import type { PlotElementChange, PlotElementKey } from '../../types/project';
import type { Story } from '../../types/story';
import IdeaHelper from '../../components/IdeaHelper';

interface Props {
  story: Story;
  changes: PlotElementChange[];
  onChange: (changes: PlotElementChange[]) => void;
}

/** 원작에서 해당 요소의 값 미리 보여 주기 */
function originalValue(story: Story, key: PlotElementKey): string {
  const hero = story.characters[0];
  switch (key) {
    case 'protagonist':
      return hero?.name ?? '';
    case 'personality':
      return hero?.personality.join(', ') ?? '';
    case 'ability':
      return hero?.strengths.join(', ') ?? '';
    case 'wish':
      return hero?.goal ?? '';
    case 'sidekick':
      return story.characters.find((c) => c.proppRole === 'helper')?.name ?? '(원작 참고)';
    case 'antagonist':
      return story.characters.find((c) => c.proppRole === 'villain')?.name ?? '(원작 참고)';
    case 'era':
      return story.publicationPeriod;
    case 'place':
      return story.background;
    case 'problem':
      return story.conflict;
    case 'ending':
      return story.ending;
    case 'message':
      return story.themes.join(', ');
    default:
      return '(원작 참고)';
  }
}

/**
 * 줄거리 다시 쓰기 3단계: 바꿀 요소 고르기.
 * 각 요소는 원작 그대로 / 추천 선택지 / 직접 입력 / 아이디어 도움받기 중에서 정합니다.
 */
export default function PlotElementsEditor({ story, changes, onChange }: Props) {
  function getChange(key: PlotElementKey): PlotElementChange {
    return changes.find((c) => c.key === key) ?? { key, mode: 'original', value: '' };
  }

  function setChange(next: PlotElementChange) {
    const rest = changes.filter((c) => c.key !== next.key);
    onChange(next.mode === 'original' ? rest : [...rest, next]);
  }

  const changedCount = changes.length;

  return (
    <section aria-label="바꿀 요소 고르기">
      <p className="notice">
        바꾸고 싶은 것만 골라 바꿔 보세요. 나머지는 <strong>원작 그대로</strong> 두어도 좋아요.
        지금까지 <strong>{changedCount}개</strong>를 바꿨어요.
      </p>
      {PLOT_ELEMENTS.map((el) => {
        const change = getChange(el.key);
        const isOriginal = change.mode === 'original';
        return (
          <div className="card" key={el.key}>
            <h3>{el.label}</h3>
            <p className="hint">{el.question}</p>
            <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-sub)' }}>
              원작: {originalValue(story, el.key)}
            </p>
            <div className="choice-row" role="group" aria-label={`${el.label} 선택 방법`}>
              <button
                type="button"
                className="chip"
                aria-pressed={isOriginal}
                onClick={() => setChange({ key: el.key, mode: 'original', value: '' })}
              >
                원작 그대로
              </button>
              {el.presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="chip"
                  aria-pressed={change.mode === 'preset' && change.value === p}
                  onClick={() => setChange({ key: el.key, mode: 'preset', value: p })}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="field" style={{ marginTop: '0.6rem', marginBottom: '0.5rem' }}>
              <label htmlFor={`custom-${el.key}`} className="sr-only">
                {el.label} 직접 입력
              </label>
              <input
                id={`custom-${el.key}`}
                type="text"
                placeholder="직접 쓰고 싶다면 여기에 입력하세요"
                value={change.mode === 'custom' ? change.value : ''}
                onChange={(e) =>
                  setChange(
                    e.target.value
                      ? { key: el.key, mode: 'custom', value: e.target.value }
                      : { key: el.key, mode: 'original', value: '' },
                  )
                }
              />
            </div>
            <IdeaHelper
              topic={el.key}
              context={story.titleKo}
              onPick={(text) => setChange({ key: el.key, mode: 'preset', value: text })}
            />
          </div>
        );
      })}
    </section>
  );
}
