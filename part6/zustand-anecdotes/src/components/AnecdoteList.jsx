import { useAnecdotes, useAnecdoteActions } from '../stores/anecdoteStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, removeAnecdote } = useAnecdoteActions()

 // toSorted() returns a NEW sorted array (doesn't mutate the original)
  // (a, b) => b.votes - a.votes means: bigger vote count comes first (descending)
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <ul>
      {sortedAnecdotes.map(anecdote => (
        <li key={anecdote.id}>
          {anecdote.content}
          <br />
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
           {/* only show delete when there are no votes yet */}
          {anecdote.votes === 0 && (
            <button onClick={() => removeAnecdote(anecdote.id)}>delete</button>
          )}
        </li>
      ))}
    </ul>
  )
}

export default AnecdoteList