import { Content} from "./Content";
import { Header } from "./Header";


const Course = ({ courses }) => {
    console.log("the courses array passed to Course comp", { courses });


    return (
        <div>
            <Header name={course.name} > </Header>
            <Content content={course.parts}></Content>

        </div>
    )



}

export default Course