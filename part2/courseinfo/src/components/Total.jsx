

const Total = ({ parts }) => {
    console.log("here is |Total| props :", {parts});
    
    return (
        <div>
          <b> total of {parts.reduce(
                (sum, part) => {
                     console.log('reduce function is doing this =>', sum,part)
                    return (sum + part.exercises)
                },0
            )} exercises</b>  
            
        </div>
    )
}

export default Total