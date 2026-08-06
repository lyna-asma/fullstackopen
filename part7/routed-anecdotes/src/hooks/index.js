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

    const onAddAnecdote = (anecdote) => {
        setAnecdotes(anecdotes.concat({ ...anecdote, id: Math.round(Math.random() * 10000) }))
    }

    return { anecdotes, onAddAnecdote }
}