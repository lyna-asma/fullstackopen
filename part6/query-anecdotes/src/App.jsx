import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  // we pull vote out of the hook, wire it to a button:
  const { anecdotes, isPending, isError, addAnecdote , vote} = useAnecdotes()

  if (isPending) {
    return <div>anecdote service not available due to problems in server...</div>
  }
  if (isError) return <div>anecdote service not available due to problems in server</div>

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm addAnecdote={addAnecdote} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => { vote(anecdote)}}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App