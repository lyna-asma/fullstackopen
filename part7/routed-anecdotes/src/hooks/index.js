import { useState, useEffect } from 'react'
import anecdotesService from '../services/anecdotes'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const onReset = () => {
        setValue('')
    }

    return {
        type,
        value,
        onChange,
        onReset
    }
}

// modules can have several named exports

export const useAnecdotes = () => {
    // CLARIFICATION
    // anecdotes is now a Promise object, not an array!
    const [anecdotes, setAnecdotes] = useState([])

    //  we wait for the Promise to resolve
    useEffect(() => {
        anecdotesService.getAll().then(data => {
            setAnecdotes(data) // Now we have the actual array
        })
    }, [])

    const onAddAnecdote = async (anecdote) => {
        console.log('Adding anecdote:', anecdote)
        const newAnecdote = await anecdotesService.createNew(anecdote)
        setAnecdotes(prevAnecdotes => prevAnecdotes.concat(newAnecdote))
    }

const onDeleteAnecdote = async (id) => {
    console.log('Deleting anecdote with id:', id, 'Type:', typeof id)
    
    try {
        await anecdotesService.deleteAnecdote(id)
        console.log('Delete successful from server')
        
        setAnecdotes(prevAnecdotes => {
            console.log('Previous anecdotes:', prevAnecdotes)
            const filtered = prevAnecdotes.filter(anecdote => {
                console.log('Comparing:', anecdote.id, typeof anecdote.id, 'with', id, typeof id)
                return anecdote.id !== id
            })
            console.log('Filtered anecdotes:', filtered)
            return filtered
        })
    } catch (error) {
        console.error('Delete failed:', error)
    }
}
    return { anecdotes, onAddAnecdote, onDeleteAnecdote }
}