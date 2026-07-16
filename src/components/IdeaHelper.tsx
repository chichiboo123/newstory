import { useState } from 'react';
import { getProvider, getFallbackProvider } from '../providers/ai';
import type { IdeaResponse } from '../providers/ai';
import AiModelIndicator from './AiModelIndicator';

interface Props {
  topic: string;
  context: string;
  /** 어린이가 아이디어 하나를 선택했을 때 */
  onPick: (text: string) => void;
  label?: string;
}

/**
 * '아이디어 도움받기' 버튼.
 * - 버튼을 눌렀을 때만 호출 (자동 호출 없음)
 * - 생성 중 반복 클릭 방지
 * - 항상 3개의 아이디어를 제안하고, 어린이가 선택한 것만 반영
 * - 원격 도우미 실패 시 로컬 카드 도우미로 자동 대체
 */
export default function IdeaHelper({ topic, context, onPick, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<IdeaResponse['ideas'] | null>(null);

  async function fetchIdeas() {
    if (loading) return;
    setLoading(true);
    try {
      let res: IdeaResponse;
      try {
        res = await getProvider().generateIdeas({ topic, context });
      } catch {
        res = await getFallbackProvider().generateIdeas({ topic, context });
      }
      setIdeas(res.ideas);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="helper-bar">
        <button type="button" className="btn btn-secondary btn-sm" onClick={fetchIdeas} disabled={loading} aria-busy={loading}>
          {loading ? '아이디어를 찾는 중…' : (label ?? '💡 아이디어 도움받기')}
        </button>
        <AiModelIndicator />
      </div>
      {ideas && (
        <div className="idea-cards" role="list" aria-label="추천 아이디어">
          {ideas.map((idea, i) => (
            <button key={i} type="button" role="listitem" className="idea-card" onClick={() => onPick(idea.title)}>
              <strong>{idea.title}</strong>
              <span>{idea.description}</span>
            </button>
          ))}
        </div>
      )}
      {ideas && (
        <p className="hint" style={{ marginTop: '0.4rem', fontSize: 'var(--fs-small)', color: 'var(--color-text-sub)' }}>
          마음에 드는 카드를 누르면 입력돼요. 마음에 없으면 다시 도움을 받거나 직접 써 보세요!
        </p>
      )}
    </div>
  );
}
