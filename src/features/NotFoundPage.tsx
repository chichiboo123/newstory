import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <p style={{ fontSize: '3rem', margin: 0 }} aria-hidden="true">
        🧭
      </p>
      <h1>길을 잃었어요!</h1>
      <p>찾으시는 페이지가 없어요. 도서관으로 돌아가 볼까요?</p>
      <Link className="btn btn-primary" to="/">
        📖 도서관으로 돌아가기
      </Link>
    </div>
  );
}
