import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kent C. Dodds',
    url: 'http://example.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' }
  }

  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} currentUser={{ username: 'testuser' }} />)

  // title and author should be visible by default
  screen.getByText('Component testing is done with react-testing-library', { exact: false })
  screen.getByText('Kent C. Dodds', { exact: false })

  // the hidden section should not be visible by default
  const div = document.querySelector('.togglableContent')
  expect(div).not.toBeVisible()
})

// testing view button functionality 

test('shows url and likes when the view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kent C. Dodds',
    url: 'http://example.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' }
  }

  // 1 setup 
  const user = userEvent.setup()

  // 2 render
  render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      currentUser={{ username: 'testuser' }}
    />
  )
//3 getting the button
  const viewButton = screen.getByText('view')
//4 clicking the button
  await user.click(viewButton)

  const div = document.querySelector('.togglableContent')
  expect(div).toBeVisible()

  // we should be able to acces them by screen now after the click 
  screen.getByText('http://example.com', { exact: false })
  screen.getByText('5', { exact: false })
})


test('clicking the like button twice calls handleLike twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Kent C. Dodds',
    url: 'http://example.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' }
  }

  // 1 mock handler 
  // vi.fn() creates a MOCK FUNCTION.
  // It's a fake, empty function — calling it does nothing on its own,
  // but Vitest secretly tracks every time it gets called, and with what arguments.
  // Think of it as a spy: it doesn't act, it just watches and records.
  const mockHandleLike = vi.fn()

  // 2 userevent setup
  const user = userEvent.setup()

  // 3 render
  render(
    <Blog
      blog={blog}
      // THIS is the key line for the mock.
      // In real App.jsx, `handleLike` would be App's real function that
      // calls the backend and updates state. Here, we're NOT using that real one.
      // We're handing Blog our fake `mockHandleLike` instead, under the same prop name.
      // Blog has no idea it's fake — it just calls whatever function it was given
      // when the like button is clicked, exactly like it would in production.
      handleLike={mockHandleLike}
      handleDelete={() => {}} // another mock, just an empty function since this test doesn't care about delete
      currentUser={{ username: 'testuser' }}
    />
  )

  // the like button lives inside the hidden/collapsed section,
  // so we click "view" first to expand it before we can even find the like button
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  // clicking the like button runs Blog's internal `likeBlog` function,
  // which in turn calls `handleLike(blog)` — but since `handleLike` prop
  // is actually our mock, this doesn't hit the real backend at all.
  // It just gets RECORDED by the mock as "I was called, here's what with"
  await user.click(likeButton)
  await user.click(likeButton) // clicked a second time — mock records a 2nd call

  // NOW we check the mock's recorded history.
  // mockHandleLike.mock.calls is an array where each entry represents
  // one time the mock was called. Since we clicked twice, we expect
  // this array to have exactly 2 entries (regardless of what arguments were passed).
  expect(mockHandleLike.mock.calls).toHaveLength(2)
})