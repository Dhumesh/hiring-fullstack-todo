import { useEffect, useMemo, useState } from 'react'
import {
  deleteAdminUser,
  downloadAdminReport,
  getAdminTodos,
  getAdminUsers,
  updateAdminUser,
} from '../api'

function AdminPage({ currentUser }) {
  const [adminError, setAdminError] = useState('')
  const [adminTodos, setAdminTodos] = useState([])
  const [editingUserId, setEditingUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' })
  const [users, setUsers] = useState([])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAdminData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const stats = useMemo(() => {
    const completed = adminTodos.filter((todo) => todo.done).length
    const pending = adminTodos.length - completed
    const completionRate = adminTodos.length ? Math.round((completed / adminTodos.length) * 100) : 0

    return { completed, completionRate, pending, total: adminTodos.length, users: users.length }
  }, [adminTodos, users])

  async function loadAdminData() {
    setLoading(true)
    setAdminError('')

    try {
      const [userData, todoData] = await Promise.all([getAdminUsers(), getAdminTodos()])
      setUsers(userData)
      setAdminTodos(todoData)
    } catch (error) {
      setAdminError(error.response?.data?.message || 'Could not load admin data.')
    } finally {
      setLoading(false)
    }
  }

  function startEditingUser(user) {
    setEditingUserId(user._id)
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    })
  }

  function updateUserForm(event) {
    setUserForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function saveUser(userId) {
    try {
      const updatedUser = await updateAdminUser(userId, userForm)
      setUsers((current) => current.map((user) => (user._id === userId ? updatedUser : user)))
      setEditingUserId('')
    } catch (error) {
      setAdminError(error.response?.data?.message || 'Could not update user.')
    }
  }

  async function removeUser(userId) {
    try {
      await deleteAdminUser(userId)
      setUsers((current) => current.filter((user) => user._id !== userId))
      setAdminTodos((current) => current.filter((todo) => todo.owner?._id !== userId))
    } catch (error) {
      setAdminError(error.response?.data?.message || 'Could not delete user.')
    }
  }

  async function downloadReport() {
    try {
      const blob = await downloadAdminReport()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'taskflow-report.csv'
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setAdminError(error.response?.data?.message || 'Could not download report.')
    }
  }

  const recentItems = adminTodos.slice(0, 5)

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
          <a href="#tasks">Tasks</a>
          <a href="#reports">Reports</a>
        </nav>
        <button onClick={downloadReport} type="button">Download Report</button>
      </aside>

      <section className="admin-canvas">
        <div className="admin-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Signed in as {currentUser?.email || 'admin user'}</p>
          </div>
          <button className="primary-button admin-report-button" onClick={downloadReport} type="button">
            Download CSV Report
          </button>
        </div>

        {adminError && <div className="alert">{adminError}</div>}
        {loading && <div className="empty-state">Loading admin dashboard...</div>}

        <section className="metrics-grid">
          <article className="metric-card wide">
            <span>Total Users</span>
            <strong>{stats.users}</strong>
            <p>{stats.completionRate}% task completion rate</p>
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

        <section className="activity-table" id="users">
          <div className="table-heading">
            <h2>Users</h2>
            <button onClick={loadAdminData} type="button">Refresh</button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isEditing = editingUserId === user._id
                  const isCurrentUser = currentUser?.id === user._id

                  return (
                    <tr key={user._id}>
                      <td>
                        {isEditing ? (
                          <input name="name" onChange={updateUserForm} value={userForm.name} />
                        ) : (
                          <strong>{user.name}</strong>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input name="email" onChange={updateUserForm} value={userForm.email} />
                        ) : (
                          <span>{user.email}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select name="role" onChange={updateUserForm} value={userForm.role}>
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <em className={user.role === 'admin' ? 'status done-status' : 'status'}>
                            {user.role || 'user'}
                          </em>
                        )}
                      </td>
                      <td>
                        <div className="admin-actions">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveUser(user._id)} type="button">Save</button>
                              <button onClick={() => setEditingUserId('')} type="button">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEditingUser(user)} type="button">Edit</button>
                              <button
                                className="danger"
                                disabled={isCurrentUser}
                                onClick={() => removeUser(user._id)}
                                type="button"
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="activity-table" id="tasks">
          <div className="table-heading">
            <h2>All Tasks</h2>
            <button onClick={downloadReport} type="button">Download Report</button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Updated</th>
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
                    <td>{todo.owner?.email || 'Unassigned'}</td>
                    <td>{todo.updatedAt ? new Date(todo.updatedAt).toLocaleDateString() : 'Today'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  )
}

export default AdminPage
