import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useMatch, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const Page = styled.div`
  padding: 1em 2em;
  max-width: 700px;
  margin: 0 auto;
`

const Navigation = styled.div`
  background: #34495e;
  padding: 0.75em 1em;
  border-radius: 4px;
  margin-bottom: 1em;

  a {
    color: white;
    text-decoration: none;
    margin-right: 1em;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }

  span {
    color: #dcdde1;
    float: right;
  }
`

// NOTE: there is NO <Router> here. The <Router> (BrowserRouter) lives in
// main.jsx, wrapping <App />. Why: React Router's useMatch hook (used below)
// cannot be called inside the same component that defines the <Routes>/<Route>
// tree it's matching against - it needs to sit "outside" that tree, which
// means Router has to be a level above App, not inside App.
// If you put a second <Router> here too, you get NESTED routers, which React
// Router does not support and will misbehave / throw.

const App = () => {
  // ---- STATE ----
  // App is the single owner of all shared state: the blog list, the logged-in
  // user, the login form fields, and the notification banner. Every route
  // below is just a different "view" onto this same state - none of the
  // child components (Blog, BlogForm, LoginForm) keep their own copy of it.
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  // useNavigate() has to be called inside a component that's rendered
  // BELOW the <Router> in main.jsx - which App is - so this works fine here.
  const navigate = useNavigate()

  // Fetch all blogs once when the app first mounts (empty dependency array).
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  // On mount, check localStorage for a previously logged-in user, so a page
  // refresh doesn't log the user out. Also re-attaches their token to the
  // blogService module so authenticated requests (create/update/delete) work.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // ---- LOGIN / LOGOUT ----
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      // No explicit navigate() call is needed here: once `user` becomes
      // truthy, the "/login" route below re-renders and its own element
      // becomes <Navigate replace to="/" />, which redirects automatically.
    } catch {
      setNotification({ message: 'wrong credentials', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    // Imperative navigate, same category as addBlog/deleteBlog: logging out
    // is a one-time reaction to this click, not something a route ternary
    // is already checking for elsewhere - so there's no "free" declarative
    // redirect to piggyback on the way there was for handleLogin.
    navigate('/')
  }

  // ---- BLOG CRUD ----
  // addBlog is passed down to BlogForm as the `createBlog` prop. BlogForm
  // itself calls navigate('/') after this resolves, redirecting the user
  // back to the blog list - that redirect logic lives in BlogForm.jsx, not
  // here, because BlogForm is the component that's actually rendered on the
  // "/create" route and has access to useNavigate there.
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch {
      setNotification({ message: 'wrong information', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  // handleLike is passed to Blog as the `handleLike` prop. It sends the
  // FULL updated blog object to the backend (PUT expects title/author/url
  // too, not just the incremented like count).
  const handleLike = async (blogToUpdate) => {
    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user?.id || blogToUpdate.user
    }
    try {
      const returnedBlog = await blogService.update(blogToUpdate.id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
    } catch {
      setNotification({ message: 'Failed to update likes', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  // handleDelete is passed to Blog as the `handleDelete` prop. Blog itself
  // calls navigate('/') right after calling this, redirecting the user back
  // to the list once deletion is triggered.
  const handleDelete = async (blogToDelete) => {
    try {
      await blogService.remove(blogToDelete.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      setNotification({ message: `Blog "${blogToDelete.title}" deleted successfully`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch {
      setNotification({ message: 'Failed to delete blog', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }



  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <Page>
      {/* Navigation bar: <Link> changes the URL without a full page reload.
          It's conditional on `user` so logged-out visitors only see "login",
          while logged-in visitors see "create new" and a logout button. */}
      <Navigation>
        <Link to="/">blogs</Link>
        {user
          ? <>
              <Link to="/create">create new</Link>
              <span>{user.name} logged in <button onClick={handleLogout}>logout</button></span>
            </>
          : <Link to="/login">login</Link>
        }
      </Navigation>

      <Notification notification={notification} />

      {/* <Routes> picks exactly ONE <Route> to render based on the current
          URL, matching top to bottom. Everything else on screen (nav bar,
          notification) stays mounted regardless of route. */}
      <Routes>
        {/* If already logged in, redirect away from /login instead of
            showing the form again. <Navigate> is React Router's way of
            doing a redirect from inside a route's element. */}
        <Route path="/login" element={
          user ? <Navigate replace to="/" /> :
          <LoginForm handleLogin={handleLogin} />
        } />

        {/* Route guard: only logged-in users may reach /create. Anyone else
            gets bounced to /login. */}
        <Route path="/create" element={
          !user ? <Navigate replace to="/login" /> :
          <BlogForm createBlog={addBlog} />
        } />

        {/* Parameterized route. React Router extracts the :id part of the
            URL and (via useMatch above) we look up the matching blog and
            pass just THAT blog down - Blog never has to search the array
            itself. */}
        <Route path="/blogs/:id" element={
          <Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} currentUser={user} />
        } />

        {/* Root route: the full blog list, sorted by likes descending.
            BlogList is the direct equivalent of the course's NoteList - the
            only structural difference from the notes app is that the blog
            app has no separate "Home" page: "/" IS the list. */}
        <Route path="/" element={<BlogList blogs={blogs} />} />
      </Routes>
    </Page>
  )
}

export default App