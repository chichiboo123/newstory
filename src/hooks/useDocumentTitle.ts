import { useEffect } from 'react';

const BASE = '안녕, 동화';
const DEFAULT_FULL = `${BASE} · 나만의 이야기로 다시 쓰는 동화 도서관`;

/**
 * 페이지마다 고유한 문서 타이틀을 설정합니다.
 * (KRDS/웹 접근성: 각 화면은 내용을 알 수 있는 제목을 가져야 함)
 * 예: useDocumentTitle('동화 도서관') → "동화 도서관 · 안녕, 동화"
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : DEFAULT_FULL;
  }, [title]);
}
