import { useCallback, useEffect, useState } from 'react'
import {
  createTodo,
  deleteTodo,
  getTodos,
  loginUser,
  setAuthToken,
  signupUser,
  toggleTodoDone,
  updateTodo,
} from './develop/api'
import AppShell from './develop/components/AppShell'
import AdminPage from './develop/pages/AdminPage'
import LoginPage from './develop/pages/LoginPage'
import SignupPage from './develop/pages/SignupPage'
import TasksPage from './develop/pages/TasksPage'
import './App.css'

const savedSession = JSON.parse(localStorage.getItem('taskflowSession') || 'null')

function App() {
  const [activeView, setActiveView] = useState(savedSession ? 'tasks' : 'login')
  const [authError, setAuthError] = useState('')
  const [currentUser, setCurrentUser] = useState(savedSession?.user || null)
  const [loading, setLoading] = useState(false)
  const [taskError, setTaskError] = useState('')
  const [todos, setTodos] = useState([])
  const [token, setToken] = useState(savedSession?.token || '')

  function saveSession(data) {
    localStorage.setItem(
      'taskflowSession',
      JSON.stringify({
        token: data.token,
        user: data.user,
      }),
    )
    setToken(data.token)
    setCurrentUser(data.user)
    setActiveView(data.user?.role === 'admin' ? 'admin' : 'tasks')
  }

  async function handleLogin(payload) {
    setLoading(true)
    setAuthError('')

    try {
      const data = await loginUser(payload)
      saveSession(data)
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(payload) {
    setLoading(true)
    setAuthError('')

    try {
      const data = await signupUser(payload)
      saveSession(data)
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem('taskflowSession')
    setAuthToken('')
    setToken('')
    setCurrentUser(null)
    setTodos([])
    setActiveView('login')
  }, [])

  const loadTodos = useCallback(async () => {
    setLoading(true)
    setTaskError('')

    try {
      const data = await getTodos()
      setTodos(data)
    } catch (error) {
      setTaskError(error.response?.data?.message || 'Could not load tasks.')
      if (error.response?.status === 401) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [handleLogout])

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  useEffect(() => {
    if (!token) {
      return
    }

    const timer = window.setTimeout(() => {
      loadTodos()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadTodos, token])

  async function handleCreateTodo(payload) {
    setTaskError('')

    try {
      const createdTodo = await createTodo(payload)
      setTodos((current) => [createdTodo, ...current])
    } catch (error) {
      setTaskError(error.response?.data?.message || 'Could not create task.')
    }
  }

  async function handleUpdateTodo(id, payload) {
    setTaskError('')

    try {
      const updatedTodo = await updateTodo(id, payload)
      setTodos((current) => current.map((todo) => (todo._id === id ? updatedTodo : todo)))
    } catch (error) {
      setTaskError(error.response?.data?.message || 'Could not update task.')
    }
  }

  async function handleToggleTodo(id) {
    setTaskError('')

    try {
      const updatedTodo = await toggleTodoDone(id)
      setTodos((current) => current.map((todo) => (todo._id === id ? updatedTodo : todo)))
    } catch (error) {
      setTaskError(error.response?.data?.message || 'Could not update task status.')
    }
  }

  async function handleDeleteTodo(id) {
    setTaskError('')

    try {
      await deleteTodo(id)
      setTodos((current) => current.filter((todo) => todo._id !== id))
    } catch (error) {
      setTaskError(error.response?.data?.message || 'Could not delete task.')
    }
  }

  if (!token && activeView === 'signup') {
    return (
      <SignupPage
        error={authError}
        loading={loading}
        onNavigate={setActiveView}
        onSignup={handleSignup}
      />
    )
  }

  if (!token) {
    return (
      <LoginPage
        error={authError}
        loading={loading}
        onLogin={handleLogin}
        onNavigate={setActiveView}
      />
    )
  }

  const safeActiveView = currentUser?.role === 'admin' ? activeView : 'tasks'

  return (
    <AppShell
      activeView={safeActiveView}
      currentUser={currentUser}
      onLogout={handleLogout}
      onNavigate={(view) => {
        if (view === 'admin' && currentUser?.role !== 'admin') {
          setActiveView('tasks')
          return
        }

        setActiveView(view)
      }}
    >
      {safeActiveView === 'admin' ? (
        <AdminPage currentUser={currentUser} />
      ) : (
        <TasksPage
          error={taskError}
          loading={loading}
          onCreateTodo={handleCreateTodo}
          onDeleteTodo={handleDeleteTodo}
          onToggleTodo={handleToggleTodo}
          onUpdateTodo={handleUpdateTodo}
          todos={todos}
        />
      )}
    </AppShell>
  )
}

export default App
