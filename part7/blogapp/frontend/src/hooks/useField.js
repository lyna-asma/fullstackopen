import { useState } from 'react'


// the hook receives the type of the form feild it s being used for
const useField = (type) => {
  // Every time a component calls useField(...), React gives it its OWN
  // separate value/setValue pair. Two calls to useField in the same
  // component = two completely independent pieces of state, just like
  // calling useState twice normally.
  const [value, setValue] = useState('')

  // This replaces handleUsername/handlePassword.
  // It's the exact same idea: take the event, read what the user typed
  // (event.target.value), store it. The hook just writes this once,
  // instead of you writing a near-identical function for every field.
  const onChange = (event) => {
    setValue(event.target.value)
  }

  // Extra function, not something useState gives you automatically.
  // Calling reset() sets the value back to '' — useful after a
  // successful submit, so the form clears itself.


  // NOTE: in LoginForm.jsx 
// Don't spread `reset` onto <Input> - it's not a real HTML attribute, bcz the spread process is matching the attributes of the useFeild state to the actual dom attributes and if they dont exist this will fire an error 
// React will warn and just drop it. reset() only works because we
// call it manually in onSubmit, not by spreading it onto the DOM.
  const reset = () => {
    setValue('')
  }

  // Instead of returning [value, setValue] like useState does, this
  // returns a plain object with named properties. That's a deliberate
  // choice: an object lets you spread it directly onto a JSX element
  // as props, e.g. <input {...usernameField} /> becomes
  // <input type="..." value="..." onChange={...} />, all three props
  // set in one go instead of writing each one by hand.
  return { type, value, onChange, reset }
}

export default useField