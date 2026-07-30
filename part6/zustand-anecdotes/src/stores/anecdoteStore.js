import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create((set) => ({
  anecdotes: [], // start empty — data now comes from the backend, not anecdotesAtStart
  filter: "",
  actions: {

    vote: async (id) => {
      // find the current anecdote in state so we know its current vote count
      const anecdoteToVote = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }

      // send the updated anecdote to the backend, get back the saved version
      const returnedAnecdote = await anecdoteService.update(id, updatedAnecdote)
      console.log("the updated anecdote with new votes number :", returnedAnecdote)
      set((state) => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? returnedAnecdote : anecdote
        )
      }))
    },

    addAnecdote: async (content) => {
      // backend expects content + votes; it assigns the id itself
      const newAnecdote = await anecdoteService.create({ content, votes: 0 })
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote]
      }))
    },
    setFilter: (filter) => set({ filter }),
    // new: replaces the whole anecdotes array with what the backend sends
    setAnecdotes: (anecdotes) => set({ anecdotes })
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes.filter(a => a.content.includes(filter))
}

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)