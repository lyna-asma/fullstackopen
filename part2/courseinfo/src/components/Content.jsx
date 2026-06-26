
import  Part  from "./Part";

const Content = ({content}) => {
  console.log('here is |Content| props', {content} );
  return (
        <div>
            {content.map(part => <Part key={part.id} part= {part}></Part>)}
        </div>
      )
}

export default Content