import type { Character } from '../types/story';
import { PROPP_ROLE_LABELS } from '../types/story';

/** 등장인물 정보 카드 (프로프 역할 표시 포함) */
export default function CharacterCard({
  character,
  children,
}: {
  character: Character;
  children?: React.ReactNode;
}) {
  return (
    <article className="card character-card">
      <h3>
        {character.name}
        <span className="role-badge">{PROPP_ROLE_LABELS[character.proppRole]}</span>
        <span className="role-badge" style={{ background: 'var(--color-secondary-soft)', color: 'var(--color-secondary)' }}>
          {character.type}
        </span>
      </h3>
      <dl>
        <dt>역할</dt>
        <dd>{character.role}</dd>
        <dt>겉모습</dt>
        <dd>{character.appearance}</dd>
        <dt>성격</dt>
        <dd>{character.personality.join(', ')}</dd>
        <dt>잘하는 것</dt>
        <dd>{character.strengths.join(', ') || '—'}</dd>
        <dt>어려워하는 것</dt>
        <dd>{character.weaknesses.join(', ') || '—'}</dd>
        <dt>가장 원하는 것</dt>
        <dd>{character.goal}</dd>
        {character.relationships.length > 0 && (
          <>
            <dt>다른 인물과의 관계</dt>
            <dd>{character.relationships.map((r) => r.description).join(' / ')}</dd>
          </>
        )}
        <dt>이야기 속 변화</dt>
        <dd>{character.change}</dd>
      </dl>
      {children}
    </article>
  );
}
