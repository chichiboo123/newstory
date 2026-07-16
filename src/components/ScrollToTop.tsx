import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** 라우트가 바뀔 때마다 화면 맨 위로 이동 (긴 목록·편집기에서 새 화면이 위에서 시작하도록) */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}
