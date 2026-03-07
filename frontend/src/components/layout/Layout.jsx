import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LuLayoutDashboard, LuPill, LuFolderTree, LuShoppingCart, LuLogOut, LuShieldCheck } from 'react-icons/lu';
import { AuthContext } from '../../context/AuthContext';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { to: '/', icon: LuLayoutDashboard, label: 'Tableau de bord', end: true },
    { to: '/medicaments', icon: LuPill, label: 'Médicaments' },
    { to: '/categories', icon: LuFolderTree, label: 'Catégories' },
    { to: '/ventes', icon: LuShoppingCart, label: 'Ventes' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>
            <span className="logo-icon">
              <LuShieldCheck size={20} />
            </span>
            Pharma<span>Manager</span>
          </h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <item.icon className="nav-icon" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username || 'Utilisateur'}</div>
            <div className="sidebar-user-role">Pharmacien</div>
          </div>
          <button className="sidebar-logout-btn" onClick={logout} title="Déconnexion">
            <LuLogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
