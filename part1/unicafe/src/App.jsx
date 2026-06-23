import { useState } from 'react'

const FeedbackHeader = () => (
  <div>
    <h1>give feedback</h1>
  </div>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)



const Statistics = ({ good, neutral, bad }) => (
  <div>
    <h1>
      statistics
    </h1>
    <ul>
      <li>good {good}</li>
      <li>neutral {neutral}</li>
      <li>bad {bad}</li>
    </ul>
  </div>
)


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <div>
        <FeedbackHeader />
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App