import { Link } from 'react-router-dom'

// This is the blog-app equivalent of the course's NoteList component.
// Just like NoteList takes `notes` as a prop and is mounted at the "/notes"
// route, BlogList takes `blogs` as a prop and is mounted at the "/" route
// (see App.jsx). It does ONE job: render the sorted list of blogs as links.
//
// It does NOT need `user` or a login check - exercise 5.24 shows the blog
// list to everyone, logged in or not. Auth-gating happens per-route in App
// (e.g. "/create" redirects to "/login" if !user), not inside this list.
const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>Blogs list :</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <div key={blog.id} className="blog">
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </div>
        )
      }
    </div>
  )
}

export default BlogList