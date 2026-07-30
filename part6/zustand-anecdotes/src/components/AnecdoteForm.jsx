import { useAnecdoteActions } from '../stores/anecdoteStore'

const AnecdoteForm = () => {
  // pulls out just the addAnecdote function from the actions object in the store
  const { addAnecdote } = useAnecdoteActions()

  const handleSubmit = (event) => {
    // stops the browser from doing a full page reload on submit (default form behavior)
    event.preventDefault()

    // this is an "uncontrolled" input: we read its value straight from the DOM
    // (event.target.anecdote) instead of tracking it in React state with useState
    const content = event.target.anecdote.value

    // clear the input field after reading it
    event.target.anecdote.value = ''

    // send the new anecdote text to the store, which wraps it into a full object
    // (content, id, votes: 0) and adds it to the list
    addAnecdote(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        {/* the "name" attribute here is what lets us read event.target.anecdote */}
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm