import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import anecdoteService from './services/anecdotes'
import { useAnecdoteActions } from './stores/anecdoteStore'

const App = () => {
  const { setAnecdotes } = useAnecdoteActions()

  useEffect(() => {
    // runs once, right after the component first renders (empty dependency array [])
    anecdoteService.getAll().then(anecdotes => setAnecdotes(anecdotes))
  }, [])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App