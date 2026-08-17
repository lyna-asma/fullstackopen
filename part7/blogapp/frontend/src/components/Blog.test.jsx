import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

// Blog now calls useNavigate() internally (for the redirect-after-delete),
// so every test has to render it inside SOME router - a real BrowserRouter
// would try to read/write the actual browser URL, which we don't want in a
// test environment. MemoryRouter keeps the "current URL" entirely in memory,
// which is exactly what a unit test needs.
const renderBlog = (props) => {
  return render(
    <MemoryRouter>
      <Blog {...props} />
    </MemoryRouter>
  )
}

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Kent C. Dodds',
  url: 'http://example.com',
  likes: 5,
  user: { username: 'creator', name: 'Creator Name' }
}

test('blog info and likes are shown to unauthenticated users, no buttons', () => {
  // currentUser is undefined here - simulating a visitor who isn't logged in
  renderBlog({ blog, handleLike: () => {}, handleDelete: () => {} })

  screen.getByText('Component testing is done with react-testing-library', { exact: false })
  screen.getByText('Kent C. Dodds', { exact: false })
  screen.getByText('likes 5', { exact: false })

  // Neither button should exist at all when there's no logged-in user
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('logged-in users who are not the creator see only the like button', () => {
  const currentUser = { username: 'someone-else' }

  renderBlog({ blog, handleLike: () => {}, handleDelete: () => {}, currentUser })

  screen.getByText('like')
  expect(screen.queryByText('remove')).toBeNull()
})

test("the blog's creator also sees the delete button", () => {
  const currentUser = { username: 'creator' }

  renderBlog({ blog, handleLike: () => {}, handleDelete: () => {}, currentUser })

  screen.getByText('like')
  screen.getByText('remove')
})