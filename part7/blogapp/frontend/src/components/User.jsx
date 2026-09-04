
import styled from 'styled-components'

const Container = styled.div`
  max-width: 500px;
`

const Heading = styled.h2`
  color: #34495e;
`

const SubHeading = styled.h4`
  color: #34495e;
  font-weight: 500;
  margin-top: 1.5em;
`

const BlogList = styled.ul`
  list-style: none;
  padding: 0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const BlogItem = styled.li`
  padding: 0.75em 1em;
  border-bottom: 1px solid #e1e2e6;
  color: #2c3e50;

  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`
const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 0.5em;
`

const User = ({ user }) => {


  if (!user) return null

  return (
    <Container>
      <Heading>{user.name}</Heading>
      <SubHeading>added blogs</SubHeading>
      <BlogList>
        {user.blogs.map((blog) => (
          <BlogItem key={blog.id}>{blog.title}</BlogItem>
        ))}
      </BlogList>
    </Container>
  )
}

export default User