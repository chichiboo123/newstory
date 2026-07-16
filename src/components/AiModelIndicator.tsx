import { useSyncExternalStore } from 'react';
import {
  isAIEnabled,
  getActiveModel,
  subscribeActiveModel,
  MODEL_CHAIN,
  formatModelName,
} from '../providers/ai';

/**
 * 어떤 Gemini 모델로 대화 중인지 배터리 표시등처럼 보여 줍니다.
 * - 체인 맨 앞(가장 좋은 모델) = 배터리 가득, 뒤로 갈수록 칸이 줄어듭니다.
 * - AI(Gemini)가 꺼져 있거나 아직 호출 전이면 표시하지 않습니다.
 */
export default function AiModelIndicator() {
  const active = useSyncExternalStore(subscribeActiveModel, getActiveModel, () => null);

  if (!isAIEnabled() || !active) return null;

  const total = MODEL_CHAIN.length;
  const idx = MODEL_CHAIN.indexOf(active);
  const filled = idx < 0 ? total : total - idx;
  const ratio = filled / total;
  const level = ratio > 0.66 ? 'high' : ratio > 0.33 ? 'mid' : 'low';

  return (
    <span
      className={`ai-battery ai-battery-${level}`}
      role="status"
      aria-label={`${formatModelName(active)} 모델로 대화 중 (연결 단계 ${filled}/${total})`}
      title={`지금은 ${formatModelName(active)} 모델로 도와주고 있어요.`}
    >
      <span className="ai-battery-icon" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`ai-battery-cell${i < filled ? ' on' : ''}`} />
        ))}
      </span>
      <span className="ai-battery-label">{formatModelName(active)}</span>
    </span>
  );
}
