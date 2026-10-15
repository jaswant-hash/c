import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { auth, signUpWithEmail, signInWithEmail, signInWithGoogle, signOutUser } from './assets/auth.jsx'
import { db } from './assets/firebase.js'
import './App.css'

function App() {

  // ─── Auth state ───────────────────────────────────────────────
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('signup')  // 'signup' or 'login'

  // Form inputs
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // ─── Task state ───────────────────────────────────────────────
  const [tasks, setTasks] = useState([])
  const [taskText, setTaskText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  // ─── Watch login / logout ─────────────────────────────────────
  useEffect(() => {
    const stop = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser)
      setError('')
    })
    return () => stop()
  }, [])

  // ─── Load tasks from Firestore ────────────────────────────────
  useEffect(() => {
    if (!user) { setTasks([]); return }

    const taskCollection = collection(db, 'users', user.uid, 'tasks')
    const stop = onSnapshot(taskCollection, (snapshot) => {
      const loaded = []
      snapshot.forEach((d) => loaded.push({ id: d.id, text: d.data().text }))
      setTasks(loaded)
    })
    return () => stop()
  }, [user])

  // ─── Sign Up ──────────────────────────────────────────────────
  async function handleSignUp() {
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    try {
      await signUpWithEmail(email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  // ─── Log In ───────────────────────────────────────────────────
  async function handleLogin() {
    setError('')
    try {
      await signInWithEmail(email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  // ─── Google Login ─────────────────────────────────────────────
  async function handleGoogleLogin() {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  // ─── Log Out ──────────────────────────────────────────────────
  async function handleLogout() {
    await signOutUser()
  }

  // ─── Add Task ─────────────────────────────────────────────────
  async function handleAddTask() {
    if (taskText.trim() === '') { setError('Please type a task.'); return }
    try {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), { text: taskText.trim() })
      setTaskText('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // ─── Start Edit ───────────────────────────────────────────────
  function startEdit(task) {
    setEditingId(task.id)
    setEditingText(task.text)
    setError('')
  }

  // ─── Save Edit ────────────────────────────────────────────────
  async function handleSaveEdit() {
    if (editingText.trim() === '') { setError('Task cannot be empty.'); return }
    try {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', editingId), { text: editingText.trim() })
      setEditingId(null)
      setEditingText('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  // ─── Cancel Edit ─────────────────────────────────────────────
  function handleCancelEdit() {
    setEditingId(null)
    setEditingText('')
    setError('')
  }

  // ─── Delete Task ──────────────────────────────────────────────
  async function handleDeleteTask(taskId) {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId))
      if (editingId === taskId) { setEditingId(null); setEditingText('') }
    } catch (err) {
      setError(err.message)
    }
  }


  // ─── NOT LOGGED IN → Show Auth Form ──────────────────────────
  if (!user) {
    return (
      <div className="page">
        <div className="card">

          <h1 className="title">TaskBook</h1>

          {/* Toggle buttons */}
          <div className="tab-row">
            <button
              className={mode === 'signup' ? 'tab active' : 'tab'}
              onClick={() => { setMode('signup'); setError('') }}
            >
              Sign Up
            </button>
            <button
              className={mode === 'login' ? 'tab active' : 'tab'}
              onClick={() => { setMode('login'); setError('') }}
            >
              Log In
            </button>
          </div>

          {/* Name input only on Sign Up */}
          {mode === 'signup' && (
            <input
              className="input"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === 'signup' ? (
            <button className="btn-main" onClick={handleSignUp}>Create Account</button>
          ) : (
            <button className="btn-main" onClick={handleLogin}>Log In</button>
          )}

          <div className="divider">or</div>

          <button className="btn-google" onClick={handleGoogleLogin}>
            Sign in with Google
          </button>

          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    )
  }


  // ─── LOGGED IN → Show Task Manager ───────────────────────────
  return (
    <div className="page">
      <div className="card wide">

        <div className="top-bar">
          <h1 className="title">My Tasks</h1>
          <div className="user-info">
            <span>{user.email}</span>
            <button className="btn-logout" onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        {/* Add Task */}
        <div className="add-row">
          <input
            className="input"
            type="text"
            placeholder="What do you need to do?"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <button className="btn-main" onClick={handleAddTask}>Add</button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {/* Task List */}
        {tasks.length === 0 && (
          <p className="empty-msg">No tasks yet. Add one above!</p>
        )}

        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>

              {editingId === task.id ? (
                // Edit mode
                <>
                  <input
                    className="input edit-input"
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button className="btn-save" onClick={handleSaveEdit}>Save</button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                // View mode
                <>
                  <span className="task-text">{task.text}</span>
                  <button className="btn-edit" onClick={() => startEdit(task)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </>
              )}

            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}

export default App
