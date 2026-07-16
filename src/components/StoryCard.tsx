import { Link } from 'react-router-dom';
import type { Story } from '../types/story';

/** 자체 제작 표지: 상징 이모지 + 그라디언트 (기존 책 표지·삽화를 사용하지 않음) */
export function CoverArt({ story, big }: { story: Story; big?: boolean }) {
  const [c1, c2] = story.coverVisual.colors;
  return (
    <div
      className="story-cover"
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, height: big ? 190 : undefined }}
      role="img"
      aria-label={`${story.titleKo} 표지 그림`}
    >
      <span aria-hidden="true">{story.coverVisual.emoji}</span>
    </div>
  );
}

export default function StoryCard({ story }: { story: Story }) {
  return (
    <Link to={`/story/${story.id}`} className="story-card">
      <CoverArt story={story} />
      <div className="story-card-body">
        <h3 className="story-card-title">{story.titleKo}</h3>
        <p className="story-card-meta">
          {story.authorOrOrigin} · {story.countryOrRegion}
        </p>
        <p className="story-card-meta">📖 약 {story.readingTime}분 읽기</p>
        <div className="tag-row">
          <span className="tag tag-age">{story.ageRange}</span>
          {story.themes.slice(0, 2).map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
