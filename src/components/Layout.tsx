import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      {/* KRDS/웹 접근성: 키보드 사용자가 반복되는 메뉴를 건너뛰고 본문으로 바로 이동 */}
      <a href="#main-content" className="skip-link">
        본문 바로가기
      </a>
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/" className="app-logo" aria-label="안녕, 동화 처음 화면으로">
            <span className="app-logo-badge" aria-hidden="true">
              📖
            </span>
            <span className="app-logo-text">
              안녕,&nbsp;<b>동화</b>
            </span>
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
      <main className="app-main" id="main-content">
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
