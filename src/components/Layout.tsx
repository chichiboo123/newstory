import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/" className="app-logo" aria-label="안녕, 동화 — 처음 화면으로">
            <span aria-hidden="true">📖</span> 안녕, 동화
          </NavLink>
          <nav className="app-nav" aria-label="주요 메뉴">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              동화 도서관
            </NavLink>
            <NavLink to="/my" className={({ isActive }) => (isActive ? 'active' : '')}>
              내가 쓴 이야기
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
              설정
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          「안녕, 동화」는 퍼블릭 도메인 고전 동화를 어린이가 새롭게 다시 쓰는 교육용 웹앱이에요.
          <br />
          이름, 학교, 연락처 같은 개인정보는 쓰지 않아요. 별명을 사용해 주세요! 🌟
        </p>
      </footer>
    </>
  );
}
