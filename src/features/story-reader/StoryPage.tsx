import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStoryById } from '../../data/stories';
import { FREYTAG_LABELS } from '../../types/story';
import StepBar from '../../components/StepBar';
import CharacterCard from '../../components/CharacterCard';
import { CoverArt } from '../../components/StoryCard';
import { addRecentStory } from '../../utils/storage';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

type Tab = 'intro' | 'characters' | 'scenes' | 'source';

export default function StoryPage() {
  const { storyId } = useParams();
  const story = getStoryById(storyId ?? '');
  const [tab, setTab] = useState<Tab>('intro');
  useDocumentTitle(story ? story.titleKo : '동화를 찾을 수 없어요');

  useEffect(() => {
    if (story) addRecentStory(story.id);
  }, [story]);

  if (!story) {
    return (
      <div className="card">
        <p>동화를 찾을 수 없어요. 🥲</p>
        <Link className="btn btn-primary" to="/">
          도서관으로 돌아가기
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'intro', label: '이야기 소개' },
    { key: 'characters', label: '등장인물' },
    { key: 'scenes', label: '장면 살펴보기' },
    { key: 'source', label: '출처와 검토' },
  ];

  return (
    <>
      <StepBar current={2} />
      <header className="story-header card">
        <CoverArt story={story} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1>{story.titleKo}</h1>
          <p style={{ color: 'var(--color-text-sub)' }}>
            {story.originalTitle} · {story.authorOrOrigin} · {story.publicationPeriod}
          </p>
          <p>{story.oneLineIntro}</p>
          <div className="tag-row">
            <span className="tag tag-age">{story.ageRange}</span>
            <span className="tag">{story.kind}</span>
            <span className="tag">📖 약 {story.readingTime}분</span>
            {story.themes.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link className="btn btn-primary" to={`/rewrite/${story.id}`}>
              ✏️ 이 동화 다시 쓰기
            </Link>
          </div>
        </div>
      </header>

      <div className="detail-tabs" role="tablist" aria-label="동화 정보 탭">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'intro' && (
        <section className="card" aria-label="이야기 소개">
          <h2>줄거리</h2>
          <p>{story.summary}</p>
          <dl className="info-grid">
            <div className="info-item">
              <dt>이야기의 배경</dt>
              <dd>{story.background}</dd>
            </div>
            <div className="info-item">
              <dt>이야기 속 문제</dt>
              <dd>{story.conflict}</dd>
            </div>
            <div className="info-item">
              <dt>결말</dt>
              <dd>{story.ending}</dd>
            </div>
          </dl>
          <h2 style={{ marginTop: '1.25rem' }}>🤔 생각해 볼 질문</h2>
          <ul>
            {story.thinkingQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'characters' && (
        <section className="character-grid" aria-label="등장인물">
          {story.characters.map((c) => (
            <CharacterCard key={c.id} character={c} />
          ))}
        </section>
      )}

      {tab === 'scenes' && (
        <section aria-label="장면 구조">
          <p className="notice">
            장면마다 붙은 <strong>발단 → 전개 → 절정 → 하강 → 결말</strong> 표시는 이야기가 어떻게
            산처럼 올라갔다 내려오는지 보여 줘요. (프라이타크의 이야기 산 모형)
          </p>
          <ol className="scene-list">
            {story.scenes.map((sc) => (
              <li key={sc.id} className="card scene-item">
                <h3>
                  <span className="freytag-badge">{FREYTAG_LABELS[sc.stage]}</span>
                  {sc.order}. {sc.title}
                </h3>
                <p>
                  <strong>장소:</strong> {sc.location} · <strong>감정:</strong> {sc.emotions.join(', ')}
                </p>
                <p>{sc.summary}</p>
                {sc.conflict && (
                  <p>
                    <strong>이 장면의 문제:</strong> {sc.conflict}
                  </p>
                )}
                {sc.nextConnection && (
                  <p style={{ color: 'var(--color-text-sub)' }}>➡️ {sc.nextConnection}</p>
                )}
                <div className="tag-row">
                  {sc.editableElements.map((e) => (
                    <span className="tag" key={e}>
                      바꿔 볼 수 있어요: {e}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {tab === 'source' && (
        <section className="card" aria-label="출처와 저작권 검토">
          <h2>출처와 저작권 검토</h2>
          <dl className="info-grid">
            <div className="info-item">
              <dt>원작 출처</dt>
              <dd>{story.sourceInfo.origin}</dd>
            </div>
            <div className="info-item">
              <dt>원작 언어 · 발표 시기</dt>
              <dd>
                {story.originalLanguage} · {story.publicationPeriod}
              </dd>
            </div>
            <div className="info-item">
              <dt>퍼블릭 도메인 검토</dt>
              <dd>{story.sourceInfo.publicDomainNote}</dd>
            </div>
            <div className="info-item">
              <dt>주의할 현대 각색 요소</dt>
              <dd>{story.sourceInfo.modernAdaptationCaution}</dd>
            </div>
            <div className="info-item">
              <dt>검토 상태</dt>
              <dd>✅ 검토 완료 ({story.sourceInfo.lastReviewed})</dd>
            </div>
          </dl>
        </section>
      )}

      <div className="step-nav no-print">
        <Link className="btn btn-ghost" to="/">
          ← 도서관으로
        </Link>
        <Link className="btn btn-primary" to={`/rewrite/${story.id}`}>
          다음: 바꿀 부분 고르기 →
        </Link>
      </div>
    </>
  );
}
