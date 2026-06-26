import  Content from "./Content";
import  Header  from "./Header";
import Total from './Total';

const Course = ({ course }) => {
    console.log("here is |Course| props", {course} );
    
    return (
        <div>
            <Header name={course.name} > </Header>
            <Content content={course.parts}></Content>
            <Total parts={course.parts}></Total> 
        </div>
    )
}

export default Course