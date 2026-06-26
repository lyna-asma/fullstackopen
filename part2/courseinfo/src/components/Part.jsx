
const Part = ({ part }) => {
    console.log("here is |Part| props ", { part });

    return (
        
        <p>{part.name}  {part.exercises}</p> 
        
    )
}

export default Part