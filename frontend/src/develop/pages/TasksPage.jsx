import { useMemo, useState } from 'react'

function TasksPage({
  error,
  loading,
  onCreateTodo,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTodo,
  todos,
}) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [editingForm, setEditingForm] = useState({ title: '', description: '' })

  const pendingCount = useMemo(() => todos.filter((todo) => !todo.done).length, [todos])

  function updateForm(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function submitForm(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      return
    }

    await onCreateTodo({
      title: form.title.trim(),
      description: form.description.trim(),
    })
    setForm({ title: '', description: '' })
  }

  function startEditing(todo) {
    setEditingId(todo._id)
    setEditingForm({
      title: todo.title,
      description: todo.description || '',
    })
  }

  function updateEditingForm(event) {
    setEditingForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function saveEdit(todoId) {
    if (!editingForm.title.trim()) {
      return
    }

    await onUpdateTodo(todoId, {
      title: editingForm.title.trim(),
      description: editingForm.description.trim(),
    })
    setEditingId(null)
  }

  return (
    <main className="workspace-page">
      <section className="hero-copy">
        <h1>Focus on what matters.</h1>
        <p>Simplify your day with clarity and intent.</p>
      </section>

      <section className="task-form-card">
        <form className="task-form" onSubmit={submitForm}>
          <label>
            <span>Task Title</span>
            <input
              name="title"
              onChange={updateForm}
              placeholder="What needs to be done?"
              required
              value={form.title}
            />
          </label>
          <label>
            <span>Optional Description</span>
            <textarea
              name="description"
              onChange={updateForm}
              placeholder="Add some details..."
              rows="2"
              value={form.description}
            />
          </label>
          <button className="primary-button" disabled={loading} type="submit">
            + Add Task
          </button>
        </form>
      </section>

      <div className="section-heading">
        <h2>Active Tasks</h2>
        <span>{pendingCount} Pending</span>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="empty-state">Loading tasks...</div>}

      <section className="task-list">
        {!loading && todos.length === 0 && (
          <div className="empty-state">No tasks yet. Add your first task above.</div>
        )}

        {todos.map((todo, index) => {
          const isEditing = editingId === todo._id

          return (
            <article
              className={todo.done ? 'task-card done' : 'task-card'}
              key={todo._id}
              style={{ '--item-index': index }}
            >
              <button
                className={todo.done ? 'done-toggle active' : 'done-toggle'}
                onClick={() => onToggleTodo(todo._id)}
                title={todo.done ? 'Mark as not done' : 'Mark as done'}
                type="button"
              >
                {todo.done ? '\u2713' : ''}
              </button>

              {isEditing ? (
                <div className="task-edit-form">
                  <input
                    name="title"
                    onChange={updateEditingForm}
                    value={editingForm.title}
                  />
                  <textarea
                    name="description"
                    onChange={updateEditingForm}
                    rows="2"
                    value={editingForm.description}
                  />
                </div>
              ) : (
                <div className="task-body">
                  <h3>{todo.title}</h3>
                  {todo.description && <p>{todo.description}</p>}
                </div>
              )}

              <div className="task-actions">
                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(todo._id)} type="button">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} type="button">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(todo)} title="Edit task" type="button">
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => onDeleteTodo(todo._id)}
                      title="Delete task"
                      type="button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default TasksPage
