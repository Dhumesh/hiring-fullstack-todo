import BrandMark from './BrandMark'

const navItems = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'admin', label: 'Admin', adminOnly: true },
]

function AppShell({ activeView, children, currentUser, onNavigate, onLogout }) {
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || currentUser?.role === 'admin')

  return (
    <div className="app-shell">
      <header className="topbar">
        <BrandMark compact />
        <nav className="topnav" aria-label="Main navigation">
          {visibleNavItems.map((item) => (
            <button
              className={activeView === item.id ? 'nav-link active' : 'nav-link'}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="user-menu">
          <div className="avatar" aria-hidden="true">
            {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-copy">
            <strong>{currentUser?.name || 'User'}</strong>
            <span>{currentUser?.email || 'Signed in'}</span>
          </div>
          <button className="icon-button" onClick={onLogout} title="Log out" type="button">
            ⎋
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}

export default AppShell
