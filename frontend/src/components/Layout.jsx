import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>AI - Powered Career Platform</h1>
          <p>Welcome, {user?.name || 'User'}</p>
        </div>
        <div className="topbar-actions">
          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="content-wrap">
        <nav className="sidebar">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/resume" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Resume Analyzer
          </NavLink>
          <NavLink to="/quiz" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Mock Test
          </NavLink>
        </nav>

        <main className="main-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
