import { useAnecdoteActions } from '../stores/anecdoteStore'

const Filter = () => {
    const { setFilter } = useAnecdoteActions()

    const handleChange = (event) => {
        // no need for preventDefault here — this isn't a form submit, just a text input
        setFilter(event.target.value)
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter