import { describe, it, expect, afterEach ,beforeEach, vi } from 'vitest'
// render() mounts a real component into a fake DOM; screen lets us query what got rendered
import { render, screen , cleanup} from '@testing-library/react'
import AnecdoteList from '../components/AnecdoteList'
import useAnecdoteStore from '../stores/anecdoteStore'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

beforeEach(() => {
  // seed the store directly with anecdotes in a DELIBERATELY unsorted order
  // (lowest votes first) — if sorting works, the rendered order should differ from this
  useAnecdoteStore.setState({
    anecdotes: [
      { id: 1, content: 'Low votes', votes: 1 },
      { id: 2, content: 'High votes', votes: 10 },
      { id: 3, content: 'Medium votes', votes: 5 },
    ],
    filter: ''
  })
})

describe('AnecdoteList', () => {
  it('renders anecdotes sorted by votes, descending', () => {
    render(<AnecdoteList />)

    const items = screen.getAllByRole('listitem')

    // .textContent gives the raw text inside each <li>, as a plain string
    // .includes() just checks whether that string contains the expected anecdote text
    expect(items[0].textContent).toContain('High votes')
    expect(items[1].textContent).toContain('Medium votes')
    expect(items[2].textContent).toContain('Low votes')
  })
    it('renders only anecdotes matching the filter', () => {
    // overwrite state again for this test: same anecdotes, but now with a filter set.
    // Only "High votes" contains the substring "High", so it should be the only one shown.
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'Low votes', votes: 1 },
        { id: 2, content: 'High votes', votes: 10 },
        { id: 3, content: 'Medium votes', votes: 5 },
      ],
      filter: 'High'
    })

    render(<AnecdoteList />)

    const items = screen.getAllByRole('listitem')

    // only one <li> should exist now, since only one anecdote's content matches the filter
    expect(items).toHaveLength(1)
    expect(items[0].textContent).toContain('High votes')
  })
})

afterEach(() => {
  // unmounts whatever was rendered in the previous test, removing it from the DOM
  cleanup()
})