import { useMemo } from 'react'

function AdminPage({ currentUser, todos }) {
  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.done).length
    const pending = todos.length - completed
    const completionRate = todos.length ? Math.round((completed / todos.length) * 100) : 0

    return { completed, completionRate, pending, total: todos.length }
  }, [todos])

  const recentItems = todos.slice(0, 5)

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <strong>TaskFlow Admin</strong>
          <span>System Management</span>
        </div>
        <nav>
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#users">Users</a>
          <a href="#stats">System Stats</a>
          <a href="#tasks">Tasks</a>
          <a href="#settings">Settings</a>
        </nav>
        <button type="button">New Report</button>
      </aside>

      <section className="admin-canvas">
        <div className="admin-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Signed in as {currentUser?.email || 'admin user'}</p>
          </div>
          <input aria-label="Search system" placeholder="Search system..." />
        </div>

        <section className="metrics-grid">
          <article className="metric-card wide">
            <span>Total Tasks</span>
            <strong>{stats.total}</strong>
            <p>{stats.completionRate}% completion rate</p>
            <div className="bar-row" aria-hidden="true">
              {[35, 52, 46, 78, 64, 95].map((height) => (
                <i key={height} style={{ height: `${height}%` }} />
              ))}
            </div>
          </article>
          <article className="metric-card">
            <span>Active Tasks</span>
            <strong>{stats.pending}</strong>
          </article>
          <article className="metric-card">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </article>
        </section>

        <section className="activity-table">
          <div className="table-heading">
            <h2>Recent Task Activity</h2>
            <button type="button">View All Activity →</button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.length === 0 && (
                  <tr>
                    <td colSpan="4">No task activity yet.</td>
                  </tr>
                )}
                {recentItems.map((todo) => (
                  <tr key={todo._id}>
                    <td>
                      <strong>{todo.title}</strong>
                      <span>{todo.description || 'No description'}</span>
                    </td>
                    <td>
                      <em className={todo.done ? 'status done-status' : 'status'}>
                        {todo.done ? 'Completed' : 'Pending'}
                      </em>
                    </td>
                    <td>{todo.updatedAt ? new Date(todo.updatedAt).toLocaleDateString() : 'Today'}</td>
                    <td>{currentUser?.name || 'Current User'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="system-strip">
          <div>
            <h2>System Optimization Active</h2>
            <p>TaskFlow is ready for the next UI pass: frontend polish, README, and demo flow.</p>
          </div>
          <div className="uptime-bars" aria-hidden="true">
            {Array.from({ length: 20 }, (_, index) => (
              <i className={index === 7 ? 'warning' : ''} key={index} />
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default AdminPage
