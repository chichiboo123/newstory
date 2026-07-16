import { useState } from 'react';
import type { Story } from '../../types/story';
import type { CharacterChange } from '../../types/project';
import CharacterCard from '../../components/CharacterCard';
import { HEXACO_FACTORS } from '../../data/personality-hexaco';

/** HEXACO 성격 낱말 카드: 클릭하면 성격 칸에 낱말을 더해 줍니다. */
function PersonalityWordPicker({ onPick }: { onPick: (word: string) => void }) {
  return (
    <details className="word-picker">
      <summary>🎨 성격 낱말 카드에서 고르기</summary>
      <p className="hint" style={{ marginTop: '0.5rem' }}>
        성격 심리학의 여섯 가지 성격(HEXACO)으로 정리한 낱말이에요. 눌러서 골라 보세요.
      </p>
      {HEXACO_FACTORS.map((f) => (
        <div key={f.key} style={{ marginTop: '0.6rem' }}>
          <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: 'var(--fs-detail)' }}>{f.childName}</p>
          <div className="choice-row">
            {[...f.words, ...f.contrastWords].map((w) => (
              <button key={w} type="button" className="chip" onClick={() => onPick(w)}>
                {w}
              </button>
            ))}
          </div>
        </div>
      ))}
    </details>
  );
}

interface Props {
  story: Story;
  changes: CharacterChange[];
  onChange: (changes: CharacterChange[]) => void;
}

const EMPTY: Omit<CharacterChange, 'characterId'> = {
  name: '',
  age: '',
  genderExpression: '',
  beingType: '',
  personality: '',
  roleOrJob: '',
  ability: '',
  weakness: '',
  goal: '',
  speechStyle: '',
  relationships: '',
};

const FIELDS: { key: keyof Omit<CharacterChange, 'characterId'>; label: string; placeholder: string }[] = [
  { key: 'name', label: '이름', placeholder: '새 이름 (안 바꾸면 비워 두세요)' },
  { key: 'age', label: '나이', placeholder: '예: 10살, 아주 많음' },
  { key: 'genderExpression', label: '성별 표현', placeholder: '예: 여자아이, 남자아이, 정하지 않음' },
  { key: 'beingType', label: '어떤 존재인가요?', placeholder: '인간 · 동물 · 사물 · 상상 존재' },
  { key: 'personality', label: '성격', placeholder: '예: 용감하고 장난기 많은' },
  { key: 'roleOrJob', label: '직업 또는 역할', placeholder: '예: 발명가, 요리사, 탐험가' },
  { key: 'ability', label: '능력', placeholder: '예: 하늘을 날 수 있어요' },
  { key: 'weakness', label: '약점', placeholder: '예: 높은 곳을 무서워해요' },
  { key: 'goal', label: '목표', placeholder: '예: 잃어버린 친구를 찾는 것' },
  { key: 'speechStyle', label: '말투', placeholder: '예: 씩씩한 말투, 노래하듯 말해요' },
  { key: 'relationships', label: '다른 인물과의 관계', placeholder: '예: 늑대와 친구가 되었어요' },
];

/**
 * 등장인물 바꾸기.
 * 인물 카드를 보고 '인물 바꾸기'를 누르면 세부 항목을 수정할 수 있습니다.
 * 바뀐 설정은 다시 쓰기 화면과 완성 화면에 함께 표시되어 이야기에 반영되도록 안내합니다.
 */
export default function CharacterChangesEditor({ story, changes, onChange }: Props) {
  const [editing, setEditing] = useState<string | null>(null);

  function getChange(characterId: string): CharacterChange {
    return changes.find((c) => c.characterId === characterId) ?? { characterId, ...EMPTY };
  }

  function updateChange(characterId: string, patch: Partial<CharacterChange>) {
    const current = getChange(characterId);
    const next = { ...current, ...patch };
    const hasContent = FIELDS.some((f) => next[f.key].trim() !== '');
    const rest = changes.filter((c) => c.characterId !== characterId);
    onChange(hasContent ? [...rest, next] : rest);
  }

  function resetChange(characterId: string) {
    onChange(changes.filter((c) => c.characterId !== characterId));
    setEditing(null);
  }

  return (
    <section aria-label="등장인물 바꾸기">
      <p className="notice">
        인물의 설정을 바꾸면, 그 인물의 <strong>행동과 대사도 함께</strong> 달라져야 해요. 예를 들어
        겁 많은 주인공을 용감하게 바꿨다면, 위기의 장면에서 도망치는 대신 맞서는 모습으로 써 보세요!
      </p>
      <div className="character-grid">
        {story.characters.map((c) => {
          const change = changes.find((ch) => ch.characterId === c.id);
          const isEditing = editing === c.id;
          return (
            <CharacterCard key={c.id} character={c}>
              {change && !isEditing && (
                <p className="notice" style={{ marginTop: '0.6rem' }}>
                  ✨ 바꾼 설정: {FIELDS.filter((f) => change[f.key]).map((f) => `${f.label}→${change[f.key]}`).join(', ')}
                </p>
              )}
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(isEditing ? null : c.id)}>
                  {isEditing ? '접기' : change ? '바꾼 설정 수정하기' : '🪄 인물 바꾸기'}
                </button>
                {change && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => resetChange(c.id)}>
                    원작대로 되돌리기
                  </button>
                )}
              </div>
              {isEditing && (
                <div style={{ marginTop: '0.75rem' }}>
                  {FIELDS.map((f) => (
                    <div className="field" key={f.key} style={{ marginBottom: '0.6rem' }}>
                      <label htmlFor={`${c.id}-${f.key}`}>{f.label}</label>
                      <input
                        id={`${c.id}-${f.key}`}
                        type="text"
                        placeholder={f.placeholder}
                        value={getChange(c.id)[f.key]}
                        onChange={(e) => updateChange(c.id, { [f.key]: e.target.value })}
                      />
                      {f.key === 'personality' && (
                        <PersonalityWordPicker
                          onPick={(word) => {
                            const cur = getChange(c.id).personality.trim();
                            const parts = cur ? cur.split(/,\s*/) : [];
                            if (!parts.includes(word)) {
                              updateChange(c.id, { personality: [...parts, word].join(', ') });
                            }
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CharacterCard>
          );
        })}
      </div>
    </section>
  );
}
