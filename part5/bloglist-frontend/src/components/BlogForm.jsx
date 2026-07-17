import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitle = (event) => setTitle(event.target.value)
  const handleAuthor = (event) => setAuthor(event.target.value)
  const handleUrl = (event) => setUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h2>Create New Blog :</h2>
      <label>
        Title :
        <input value={title} onChange={handleTitle} />
      </label>
      <label>
        Url :
        <input value={url} onChange={handleUrl} />
      </label>
      <label>
        Author :
        <input value={author} onChange={handleAuthor} />
      </label>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm