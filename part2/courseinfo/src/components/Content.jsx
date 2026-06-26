
import { Part } from "./component/Part";

const Content = (content) => {
  return (
        <ul>
            {content.map(part => <Part key={part.id} part= {part}></Part>)}
        </ul>
      )
}

export default Content