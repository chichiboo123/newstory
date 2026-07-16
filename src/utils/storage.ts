import type { RewriteProject, ProjectExport } from '../types/project';

/**
 * 브라우저 localStorage 기반 프로젝트 저장소.
 * - 로그인 없이 동작하며, 개인정보를 수집하지 않습니다.
 * - 어린이가 작성한 내용이 사라지지 않도록 모든 변경은 즉시 저장됩니다.
 */

const PROJECTS_KEY = 'hello-story:projects';
const RECENT_KEY = 'hello-story:recent-stories';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadProjects(): RewriteProject[] {
  try {
    return safeParse<RewriteProject[]>(localStorage.getItem(PROJECTS_KEY), []);
  } catch {
    return [];
  }
}

export function saveProjects(projects: RewriteProject[]): void {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // 저장 공간 부족 등 — 콘솔에만 기록하고 앱은 계속 동작
    console.warn('프로젝트 저장에 실패했어요. 저장 공간을 확인해 주세요.');
  }
}

export function getProject(id: string): RewriteProject | undefined {
  return loadProjects().find((p) => p.id === id);
}

export function upsertProject(project: RewriteProject): void {
  const projects = loadProjects();
  const i = projects.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (i >= 0) projects[i] = updated;
  else projects.unshift(updated);
  saveProjects(projects);
}

export function deleteProject(id: string): void {
  saveProjects(loadProjects().filter((p) => p.id !== id));
}

export function createProject(sourceStoryId: string, mode: 'plot' | 'scene'): RewriteProject {
  const now = new Date().toISOString();
  const project: RewriteProject = {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sourceStoryId,
    projectTitle: '',
    creatorNickname: '',
    mode,
    plotChanges: [],
    plotDraft: ['', '', '', '', '', ''],
    characterChanges: [],
    rewrittenScenes: [],
    reflection: { whatChanged: '', favoriteScene: '', message: '' },
    currentStep: 3,
    createdAt: now,
    updatedAt: now,
  };
  upsertProject(project);
  return project;
}

/** JSON 파일 내보내기 */
export function exportProject(project: RewriteProject): void {
  const data: ProjectExport = {
    app: 'hello-story',
    version: 1,
    exportedAt: new Date().toISOString(),
    project,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.projectTitle || '나의-동화'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** JSON 파일 불러오기 (형식 검증 포함) */
export function importProject(json: string): RewriteProject {
  const data = JSON.parse(json) as Partial<ProjectExport>;
  if (data.app !== 'hello-story' || !data.project?.id || !data.project?.sourceStoryId) {
    throw new Error('「안녕, 동화」에서 저장한 파일이 아니에요.');
  }
  const project = data.project as RewriteProject;
  // 같은 id가 이미 있으면 새 id로 가져와 기존 작업을 보호
  if (getProject(project.id)) {
    project.id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  upsertProject(project);
  return project;
}

/** 최근 읽은 동화 기록 (최대 8개) */
export function getRecentStories(): string[] {
  try {
    return safeParse<string[]>(localStorage.getItem(RECENT_KEY), []);
  } catch {
    return [];
  }
}

export function addRecentStory(storyId: string): void {
  try {
    const recent = [storyId, ...getRecentStories().filter((id) => id !== storyId)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch {
    // 무시
  }
}
