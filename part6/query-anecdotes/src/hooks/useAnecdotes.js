import {
    // this is bcz it s needed to wrap the fetch request with it , it receives 2 params , 1 the key param (the notes list ) , 2 the actual functions that fetches the key param value in server 
    useQuery,
    // it's to actually upate the notes in tehe server when a new note is added  or old note is modified
    useMutation,
    // this is needed to update the visual state rendered on screen with the server value of the key when it succumbs any update (ex adding a new note to the list )
    useQueryClient
} from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'

export const useAnecdotes = () => {

    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        // the retry if any error ocuusr is set to happen only once , it could be more than once or never (false)
        retry: 1,
        refetchOnWindowFocus: false
    })

    const voteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        }
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        }
    })

    return {
        anecdotes: result.data,
        isPending: result.isPending,
        isError: result.isError,
        addAnecdote: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
        vote: (anecdote) => voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })

    }
}