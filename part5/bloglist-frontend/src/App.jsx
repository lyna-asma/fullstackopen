import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';


const App = () => {
  // blog list state
  const [blogs, setBlogs] = useState([])

  // LoginForm states
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // bcz we were asked for succss notif too not just error 
  const [notification, setNotification] = useState(null) // { message, type: 'success' | 'error' }


  // BlogForm states
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // EFFECT CALLS

  // 1 "blogs" effect
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
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



  // EVENT HANDLERS blogfrom
  // 1 input feild change
  const handleTitle = (event) => {
    setTitle(event.target.value)
  }
  // 2 input feild change
  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }
  // 3 input feild change
  const handleUrl = (event) => {
    setUrl(event.target.value)
  }
  // 4 submission 

  const addBlog = async (event) => {
    event.preventDefault()
    // taking the values from the state variables to create the blog with them
    const blogObject = {
      title,
      author,
      url,
    }

    try {
      // return the blog created after calling the service and sending the post request
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      // success notif 
      setNotification({ message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, type: 'success' })
      setTimeout(() => setNotification(null), 5000)

    } catch {
      // display the error message
      // faillure notif
      setNotification({ message: 'wrong information', type: 'error' })
      // errror is shown temporarily
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
      <BlogForm addBlog={addBlog} title={title} author={author} url={url} handleAuthor={handleAuthor} handleTitle={handleTitle} handleUrl={handleUrl}></BlogForm>
      <h2>Blogs list :</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App