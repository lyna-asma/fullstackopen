import { useAnecdotes } from '../hooks'

const AnecdoteList = () =>
  
  {
const { anecdotes , onDeleteAnecdote} = useAnecdotes()

if (!anecdotes || !Array.isArray(anecdotes)) {
    console.log('Anecdotes value:', anecdotes)
    return <div>No anecdotes available</div>
  }
  

  return  (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>  <li key={anecdote.id}>{anecdote.content} <button onClick= {()=> {onDeleteAnecdote(anecdote.id)}}> delete</button></li> )}
    </ul>
  </div>
)
  }
export default AnecdoteList
