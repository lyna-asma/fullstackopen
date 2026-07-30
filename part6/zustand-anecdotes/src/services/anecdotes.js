const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  // fetch() returns a Response object — .json() reads and parses the body
  const response = await fetch(baseUrl)
  return response.json()
}

// sends a new anecdote object to the backend, backend returns the saved version (with real id)
const create = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  })
  return response.json()
}


// PUT replaces the anecdote at this id with updatedAnecdote on the backend
const update = async (id, updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  })
  return response.json()
}

export default { getAll, create , update }