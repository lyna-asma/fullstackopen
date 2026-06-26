// header component
const Header = (props) => {
  console.log('Header component is rendering...')
  console.log(props)
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

//part component
const Part = (props) => {
  
  console.log('Part component is rendering...')
  console.log(props)
  return (
    <div>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </div>
  )
}


// content component
const Content = (props) => {
  console.log('Content component is rendering...')
  console.log(props)
  return (
    <div>
      <Part part={props.parts[0]} />
      <Part part={props.parts[1]} />
      <Part part={props.parts[2]} />
    </div>
  )
}


// total component
const Total = (props) => {
  console.log('Total component is rendering...')
  console.log(props)
  return (
    <div>
      <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises } </p>
    </div>
  )
}


// app component
/*
const App = () => {
  console.log('App component is rendering...')
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }
 const parts = [part1, part2, part3]
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
*/


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />      
    </div>
  )
}

export default App