import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stories, allThemes, allRegions, allAges } from '../../data/stories';
import StoryCard from '../../components/StoryCard';
import { getRecentStories } from '../../utils/storage';
import { loadProjects } from '../../utils/storage';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

type LengthFilter = '' | 'short' | 'medium' | 'long';

export default function LibraryPage() {
  useDocumentTitle('동화 도서관');
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('');
  const [region, setRegion] = useState('');
  const [age, setAge] = useState('');
  const [length, setLength] = useState<LengthFilter>('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const recentIds = getRecentStories();
  const myProjects = loadProjects();

  const LENGTH_LABELS: Record<Exclude<LengthFilter, ''>, string> = {
    short: '짧아요 (~3분)',
    medium: '보통 (4~5분)',
    long: '길어요 (6분~)',
  };
  const activeCount = [theme, region, age, length].filter(Boolean).length;
  function clearFilters() {
    setTheme('');
    setRegion('');
    setAge('');
    setLength('');
  }

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        const hay = `${s.titleKo} ${s.originalTitle} ${s.authorOrOrigin} ${s.themes.join(' ')} ${s.oneLineIntro}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (theme && !s.themes.includes(theme)) return false;
      if (region && s.countryOrRegion !== region) return false;
      if (age && s.ageRange !== age) return false;
      if (length === 'short' && s.readingTime > 3) return false;
      if (length === 'medium' && (s.readingTime < 4 || s.readingTime > 5)) return false;
      if (length === 'long' && s.readingTime < 6) return false;
      return true;
    });
  }, [query, theme, region, age, length]);

  function goRandom() {
    const pick = stories[Math.floor(Math.random() * stories.length)];
    navigate(`/story/${pick.id}`);
  }

  const recent = recentIds.map((id) => stories.find((s) => s.id === id)).filter(Boolean);

  return (
    <>
      <section className="library-hero">
        <h1>🏰 동화 마법 도서관</h1>
        <p>오늘은 어떤 이야기를 새롭게 써 볼까요?</p>
        <ol className="how-it-works" aria-label="이렇게 놀아요">
          <li><span aria-hidden="true">1</span> 동화 고르기</li>
          <li><span aria-hidden="true">2</span> 살펴보기</li>
          <li><span aria-hidden="true">3</span> 바꿀 부분 고르기</li>
          <li><span aria-hidden="true">4</span> 다시 쓰기</li>
          <li><span aria-hidden="true">5</span> 완성하기</li>
        </ol>
      </section>

      <div className="library-toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="동화 제목이나 주제를 검색해 보세요"
          aria-label="동화 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn-primary" onClick={goRandom}>
          🎲 아무 동화나 열기
        </button>
      </div>

      {/* 필터: 기본은 접힌 상태. 화면을 버튼으로 채우지 않도록 필요할 때만 펼침 */}
      <section className="filters" aria-label="동화 거르기">
        <div className="filters-head">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            🔎 필터{activeCount > 0 ? ` · ${activeCount}개 선택` : ''} {filtersOpen ? '▲' : '▼'}
          </button>

          {activeCount > 0 && (
            <div className="active-filters" aria-label="선택한 필터 (누르면 해제)">
              {theme && (
                <button type="button" className="chip removable" onClick={() => setTheme('')}>
                  {theme} ✕
                </button>
              )}
              {region && (
                <button type="button" className="chip removable" onClick={() => setRegion('')}>
                  {region} ✕
                </button>
              )}
              {age && (
                <button type="button" className="chip removable" onClick={() => setAge('')}>
                  {age} ✕
                </button>
              )}
              {length && (
                <button type="button" className="chip removable" onClick={() => setLength('')}>
                  {LENGTH_LABELS[length]} ✕
                </button>
              )}
              <button type="button" className="btn-clear" onClick={clearFilters}>
                모두 지우기
              </button>
            </div>
          )}
        </div>

        {filtersOpen && (
          <div className="filters-panel card" id="filter-panel">
            <div className="filter-group" role="group" aria-label="주제별 필터">
              <span className="filter-label">주제</span>
              <div className="choice-row">
                {allThemes.map((t) => (
                  <button key={t} type="button" className="chip" aria-pressed={theme === t} onClick={() => setTheme(theme === t ? '' : t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group" role="group" aria-label="지역별 필터">
              <span className="filter-label">지역</span>
              <div className="choice-row">
                {allRegions.map((r) => (
                  <button key={r} type="button" className="chip" aria-pressed={region === r} onClick={() => setRegion(region === r ? '' : r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group" role="group" aria-label="추천 연령 필터">
              <span className="filter-label">연령</span>
              <div className="choice-row">
                {allAges.map((a) => (
                  <button key={a} type="button" className="chip" aria-pressed={age === a} onClick={() => setAge(age === a ? '' : a)}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group" role="group" aria-label="이야기 길이 필터">
              <span className="filter-label">길이</span>
              <div className="choice-row">
                {(Object.keys(LENGTH_LABELS) as Exclude<LengthFilter, ''>[]).map((k) => (
                  <button key={k} type="button" className="chip" aria-pressed={length === k} onClick={() => setLength(length === k ? '' : k)}>
                    {LENGTH_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <p className="result-count" role="status">
        모두 <strong>{filtered.length}</strong>편의 동화가 있어요
      </p>

      {filtered.length === 0 ? (
        <div className="card" role="status">
          <p>
            앗, 조건에 맞는 동화를 찾지 못했어요. 🧐
            <br />
            검색어나 필터를 바꿔 보거나, <strong>아무 동화나 열기</strong> 버튼을 눌러 보세요!
          </p>
        </div>
      ) : (
        <section aria-label="동화 목록" className="story-grid">
          {filtered.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </section>
      )}

      {recent.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h2>🕰️ 최근 읽은 동화</h2>
          <div className="story-grid">
            {recent.slice(0, 4).map((s) => s && <StoryCard key={s.id} story={s} />)}
          </div>
        </section>
      )}

      {myProjects.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h2>✏️ 내가 다시 쓴 동화</h2>
          <p>
            <Link to="/my">{myProjects.length}개의 이야기를 쓰고 있어요 — 이어서 쓰러 가기 →</Link>
          </p>
        </section>
      )}
    </>
  );
}
