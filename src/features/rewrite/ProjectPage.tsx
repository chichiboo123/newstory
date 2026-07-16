import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StepBar from '../../components/StepBar';
import { getStoryById } from '../../data/stories';
import { getProject, upsertProject } from '../../utils/storage';
import type { RewriteProject } from '../../types/project';
import PlotElementsEditor from './PlotElementsEditor';
import CharacterChangesEditor from './CharacterChangesEditor';
import PlotDraftEditor from './PlotDraftEditor';
import SceneRewriteEditor from './SceneRewriteEditor';
import FinishStep from '../story-preview/FinishStep';

type SubTab = 'elements' | 'characters';

/**
 * 다시 쓰기 작업 공간 (3단계: 바꿀 부분 고르기 → 4단계: 다시 쓰기 → 5단계: 완성하기).
 * 모든 변경은 즉시 localStorage에 저장되어 새로고침해도 사라지지 않습니다.
 */
export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<RewriteProject | undefined>(() => getProject(projectId ?? ''));
  const [subTab, setSubTab] = useState<SubTab>('elements');

  useEffect(() => {
    setProject(getProject(projectId ?? ''));
  }, [projectId]);

  const patch = useCallback((p: Partial<RewriteProject>) => {
    setProject((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...p };
      upsertProject(next); // 즉시 자동 저장
      return next;
    });
  }, []);

  const story = project ? getStoryById(project.sourceStoryId) : undefined;

  if (!project || !story) {
    return (
      <div className="card">
        <p>이야기 작업을 찾을 수 없어요. 🥲 삭제되었거나 다른 브라우저에서 만든 작업일 수 있어요.</p>
        <Link className="btn btn-primary" to="/my">
          내가 쓴 이야기 보러 가기
        </Link>
      </div>
    );
  }

  const step = Math.min(Math.max(project.currentStep, 3), 5);

  return (
    <>
      <StepBar current={step} onStepClick={(s) => patch({ currentStep: s })} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>
          {step === 3 && '바꿀 부분 고르기'}
          {step === 4 && '다시 쓰기'}
          {step === 5 && '완성하기'}
        </h1>
        <p className="save-status" role="status" aria-live="polite">
          원작: 『{story.titleKo}』 · ✓ 자동 저장 중
        </p>
      </div>

      {step === 3 && (
        <>
          {project.mode === 'plot' ? (
            <>
              <div className="detail-tabs" role="tablist" aria-label="바꿀 부분 종류">
                <button role="tab" aria-selected={subTab === 'elements'} onClick={() => setSubTab('elements')}>
                  🗺️ 이야기 설정 바꾸기
                </button>
                <button role="tab" aria-selected={subTab === 'characters'} onClick={() => setSubTab('characters')}>
                  🧑‍🤝‍🧑 등장인물 바꾸기
                </button>
              </div>
              {subTab === 'elements' ? (
                <PlotElementsEditor story={story} changes={project.plotChanges} onChange={(c) => patch({ plotChanges: c })} />
              ) : (
                <CharacterChangesEditor story={story} changes={project.characterChanges} onChange={(c) => patch({ characterChanges: c })} />
              )}
            </>
          ) : (
            <>
              <p className="notice">
                장면별 다시 쓰기에서는 먼저 <strong>등장인물</strong>을 바꿔 볼 수 있어요. 인물을 바꾸지
                않아도 괜찮아요. 다음 단계에서 장면을 골라 다시 쓰게 돼요.
              </p>
              <CharacterChangesEditor story={story} changes={project.characterChanges} onChange={(c) => patch({ characterChanges: c })} />
            </>
          )}
          <div className="step-nav">
            <Link className="btn btn-ghost" to={`/story/${story.id}`}>
              ← 동화 다시 보기
            </Link>
            <button type="button" className="btn btn-primary" onClick={() => patch({ currentStep: 4 })}>
              다음: 다시 쓰기 →
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          {project.mode === 'plot' ? (
            <PlotDraftEditor
              story={story}
              plotChanges={project.plotChanges}
              draft={project.plotDraft}
              onChange={(d) => patch({ plotDraft: d })}
              projectTitle={project.projectTitle}
              onTitleChange={(t) => patch({ projectTitle: t })}
            />
          ) : (
            <>
              <div className="card">
                <div className="field" style={{ marginBottom: 0 }}>
                  <label htmlFor="scene-project-title">새 이야기 제목</label>
                  <input
                    id="scene-project-title"
                    type="text"
                    value={project.projectTitle}
                    onChange={(e) => patch({ projectTitle: e.target.value })}
                    placeholder={`새로 쓴 ${story.titleKo}`}
                  />
                </div>
              </div>
              <SceneRewriteEditor story={story} rewritten={project.rewrittenScenes} onChange={(s) => patch({ rewrittenScenes: s })} />
            </>
          )}
          <div className="step-nav">
            <button type="button" className="btn btn-ghost" onClick={() => patch({ currentStep: 3 })}>
              ← 이전: 바꿀 부분 고르기
            </button>
            <button type="button" className="btn btn-primary" onClick={() => patch({ currentStep: 5 })}>
              다음: 완성하기 →
            </button>
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <FinishStep project={project} story={story} onProjectChange={patch} />
          <div className="step-nav no-print">
            <button type="button" className="btn btn-ghost" onClick={() => patch({ currentStep: 4 })}>
              ← 다시 수정하기
            </button>
            <Link className="btn btn-primary" to="/my">
              내가 쓴 이야기 보러 가기 →
            </Link>
          </div>
        </>
      )}
    </>
  );
}
