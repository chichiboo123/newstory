import type { Story } from '../../types/story';
import aesop from './aesop.json';
import grimm from './grimm.json';
import andersen from './andersen.json';
import perrault from './perrault.json';
import korea from './korea.json';
import world from './world.json';

/**
 * 전체 동화 데이터베이스.
 * 모든 작품은 퍼블릭 도메인 원전을 자체 요약한 것입니다.
 * 검토 기록은 docs/copyright-review.md 참고.
 */
export const stories: Story[] = [
  ...(aesop as Story[]),
  ...(grimm as Story[]),
  ...(andersen as Story[]),
  ...(perrault as Story[]),
  ...(korea as Story[]),
  ...(world as Story[]),
];

export function getStoryById(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}

export const allThemes: string[] = [...new Set(stories.flatMap((s) => s.themes))].sort();
export const allRegions: string[] = [...new Set(stories.map((s) => s.countryOrRegion))].sort();
export const allAges: string[] = [...new Set(stories.map((s) => s.ageRange))].sort();
