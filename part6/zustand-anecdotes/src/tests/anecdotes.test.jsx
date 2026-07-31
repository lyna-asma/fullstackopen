import { describe, it, expect, beforeEach, vi } from 'vitest'
// renderHook lets you use a React hook (like useAnecdoteActions) OUTSIDE of a component,
// just for testing purposes — normally hooks can only run inside components
import { renderHook, act } from '@testing-library/react'

// vi.mock replaces the REAL anecdoteService module with a fake one, only during this test file.
// This means when store.js calls anecdoteService.getAll(), it will NOT make a real network
// request — it calls this fake version instead, which we fully control.
// vi.fn() creates an empty "spy" function we can later tell what to return.
vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

// this import now gives us the FAKE anecdoteService (the one defined above),
// because vi.mock intercepts this import path
import anecdoteService from '../services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from '../stores/anecdoteStore'

// runs before EVERY test below, so each test starts from a clean, predictable state
beforeEach(() => {
  // resets the store's data directly (setState comes from Zustand, lets tests bypass actions)
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  // clears any previous mockResolvedValue/calls recorded on getAll, create, etc.
  // so one test's setup doesn't leak into the next test
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    // this is the fake data we WANT the fake getAll() to return, as if it came from the backend
    const mockAnecdotes = [{ id: 1, content: 'Test anecdote', votes: 0 }]

    // tells the fake getAll: "when you're called, resolve (like a successful fetch) with this data"
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    // renderHook actually runs the useAnecdoteActions() hook and gives us access to
    // whatever it returns, through result.current
    const { result } = renderHook(() => useAnecdoteActions())

    // act() wraps any code that causes React state to update, so React can
    // process that update properly before we check anything afterward.
    // it's async here because initialize() itself is an async function (it awaits a fetch)
    await act(async () => {
      // result.current is the actions object — this calls the REAL initialize function
      // from your store, which internally calls the FAKE anecdoteService.getAll()
      await result.current.initialize()
    })

    // now read the anecdotes back out of the store, using the useAnecdotes hook,
    // to check that initialize() actually put the fetched data into state
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    // if initialize() worked, the store's anecdotes should now equal what getAll() returned
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })
})