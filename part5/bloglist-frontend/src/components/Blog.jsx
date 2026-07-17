import { useState } from 'react'

const Blog = ({ blog , handleLike , handleDelete , currentUser}) => {
const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
const handleClick = ()=> {
  setVisible(!visible)
}
const likeBlog = () => {
    handleLike(blog)
  }


 const showWhenVisible = { display: visible ? '' : 'none' }

 // Check if current user is the blog creator
 const showDeleteButton = () => {
  if (!blog.user || !currentUser) {
    return false
  }
  
  // Compare by username since currentUser doesn't have an id
  const blogUsername = blog.user.username
  const currentUsername = currentUser.username
  
  return blogUsername === currentUsername
}

  const deleteBlog = () => {
    handleDelete(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} , written by , {blog.author}
        <button onClick={handleClick}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} 
          <button onClick={likeBlog}>like</button>
        </p>
        <p>{blog.user ? blog.user.name : ''}</p>
        {showDeleteButton() && (
          <button onClick={deleteBlog}>remove</button>
        )}
      </div>
    </div>
  )
}
export default Blog