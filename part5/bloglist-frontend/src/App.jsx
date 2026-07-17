import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable'

const App = () => {
  // blog list state
  const [blogs, setBlogs] = useState([])

  // LoginForm states
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // bcz we were asked for succss notif too not just error 
  const [notification, setNotification] = useState(null) // { message, type: 'success' | 'error' }

  // EFFECT CALLS

  // 1 "blogs" effect
  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log('Blogs from backend:', blogs)  // Check what the ID field is called
      setBlogs(blogs)
    })
  }, [])

  // 2 "login local storage of credentials in browser" effect 
  useEffect(() => {
    // storing in the browser the user info
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    // checking if there s any login info saved to parse when reloading the page
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // EVENT HANDLERS login

  // 1 sending the login request via the service , with the states values as credentials 
  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      // saving the user login info in the browser 
      // we can find them by pressign in the console : "loggedBlogUser" , we can clear the local storage or just remove this specific variable from it
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      // set the user token for any future queries from the blogs service that require a token (authentication-based)
      blogService.setToken(user.token)
      setUser(user)
      // epty the input feilds again
      setUsername('')
      setPassword('')
    } catch {
      // if any error occures we catch it and display the message for a short while
      setNotification({ message: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  // 2 input feild change
  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  // 3 input feild change
  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  // 4 logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  // blogForm event handlers
  // 1 submission 
  // we need REFS
  const blogFormRef = useRef()

  // App's addBlog — talks to the backend
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    } catch {
      setNotification({ message: 'wrong information', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  // 2
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

      setBlogs(blogs.map(blog =>
        blog.id !== returnedBlog.id ? blog : returnedBlog
      ))
    } catch (error) {
      console.error('Error updating likes:', error)
      setNotification({ message: 'Failed to update likes', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  // EVENT HANDLER DELETE
  const handleDelete = async (blogToDelete) => {
  if (!window.confirm(`Remove blog "${blogToDelete.title}" by ${blogToDelete.author}?`)) {
    return
  }

  try {
    await blogService.remove(blogToDelete.id)
    setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
    setNotification({ message: `Blog "${blogToDelete.title}" deleted successfully`, type: 'success' })
    setTimeout(() => setNotification(null), 5000)
  } catch (error) {
     console.error('Error deleting blog:', error)
    setNotification({ message: 'Failed to delete blog', type: 'error' })
    setTimeout(() => setNotification(null), 5000)
  }
}


  return (
    <div>

      <Notification notification={notification} />

      {!user && <LoginForm handleLogin={handleLogin} password={password} username={username} handlePassword={handlePassword} handleUsername={handleUsername} />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}

      {user && (
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      )}

      {user && (
        <>
          <h2>Blogs list :</h2>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} currentUser={user}/>
            )
          }
        </>
      )}
    </div>
  )
}

export default App