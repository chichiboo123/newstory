const STEPS = ['동화 고르기', '동화 살펴보기', '바꿀 부분 고르기', '다시 쓰기', '완성하기'];

interface Props {
  /** 현재 단계 (1~5) */
  current: number;
  /** 단계 클릭으로 되돌아가기 (3단계 이상에서 사용) */
  onStepClick?: (step: number) => void;
}

/** 화면 상단에 항상 보이는 5단계 진행 표시 */
export default function StepBar({ current, onStepClick }: Props) {
  return (
    <ol className="stepbar" aria-label="창작 진행 단계">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const state = step === current ? 'current' : step < current ? 'done' : '';
        const clickable = onStepClick && step < current && step >= 3;
        return (
          <li key={label} className={state} aria-current={step === current ? 'step' : undefined}>
            <span className="step-num" aria-hidden="true">
              {step < current ? '✓' : step}
            </span>
            {clickable ? (
              <button
                type="button"
                className="btn-link-plain"
                style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', padding: 0 }}
                onClick={() => onStepClick(step)}
              >
                {label}
              </button>
            ) : (
              label
            )}
          </li>
        );
      })}
    </ol>
  );
}
