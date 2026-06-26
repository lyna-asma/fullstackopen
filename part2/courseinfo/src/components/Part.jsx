


const Part = ({ part }) => {
    console.log("the course part passed to Part component ", { part });

    return (
        <div>
            <p>{part.name}  {part.exercises}</p> 
        </div>
    )
}

export default Part