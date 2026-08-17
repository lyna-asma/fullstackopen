import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Input = styled.input`
  margin: 0.25em 0.5em 0.25em 0;
  padding: 0.4em;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`

const Button = styled.button`
  background: #4a69bd;
  color: white;
  font-size: 1em;
  padding: 0.4em 1.2em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5em;

  &:hover {
    background: #3c58a8;
  }
`

const FormWrapper = styled.div`
  background: #f4f4f4;
  padding: 1.5em;
  border-radius: 6px;
  max-width: 400px;
`

const FieldRow = styled.div`
  margin-bottom: 0.75em;
`

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()
  const handleTitle = (event) => setTitle(event.target.value)
  const handleAuthor = (event) => setAuthor(event.target.value)
  const handleUrl = (event) => setUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <FormWrapper>
      <h2>Create New Blog :</h2>
      <form onSubmit={addBlog}>
        <FieldRow>
          <label>
            Title :
            <br />
            <Input value={title} onChange={handleTitle} />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            Url :
            <br />
            <Input value={url} onChange={handleUrl} />
          </label>
        </FieldRow>
        <FieldRow>
          <label>
            Author :
            <br />
            <Input value={author} onChange={handleAuthor} />
          </label>
        </FieldRow>
        <Button type="submit">create</Button>
      </form>
    </FormWrapper>
  )
}

export default BlogForm