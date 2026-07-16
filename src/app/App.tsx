import { HashRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import Layout from '../components/Layout';
import LibraryPage from '../features/library/LibraryPage';
import StoryPage from '../features/story-reader/StoryPage';
import NewProjectPage from '../features/rewrite/NewProjectPage';
import ProjectPage from '../features/rewrite/ProjectPage';
import MyStoriesPage from '../features/my-stories/MyStoriesPage';
import SettingsPage from '../features/settings/SettingsPage';
import NotFoundPage from '../features/NotFoundPage';

/**
 * HashRouter 사용 이유:
 * GitHub Pages는 정적 호스팅이라 /story/xyz 같은 경로로 새로고침하면 404가 납니다.
 * 해시 라우팅(#/story/xyz)은 항상 index.html을 불러오므로 새로고침에도 안전합니다.
 */
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/story/:storyId" element={<StoryPage />} />
          <Route path="/rewrite/:storyId" element={<NewProjectPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/my" element={<MyStoriesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
