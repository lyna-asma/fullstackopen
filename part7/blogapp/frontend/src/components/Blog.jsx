import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useField from "../hooks/useField";
import useBlogStore from "../stores/blogStore";

const Card = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1.5em;
  max-width: 500px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LikeRow = styled.p`
  display: flex;
  align-items: center;
  gap: 0.75em;
`;

const LikeButton = styled.button`
  background: #f6b93b;
  border: none;
  border-radius: 4px;
  padding: 0.3em 0.9em;
  cursor: pointer;

  &:hover {
    background: #e0a02f;
  }
`;

const RemoveButton = styled.button`
  background: #e55039;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3em 0.9em;
  margin-top: 1em;
  cursor: pointer;

  &:hover {
    background: #c8402e;
  }
`;
// COMMENT STYLE COMPONENTS

const CommentForm = styled.form`
  display: flex;
  gap: 0.5em;
  margin: 1em 0;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.4em 0.6em;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #f6b93b;
  }
`;

const CommentButton = styled.button`
  background: #f6b93b;
  border: none;
  border-radius: 4px;
  padding: 0.3em 0.9em;
  cursor: pointer;

  &:hover {
    background: #e0a02f;
  }
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1em;
`;

const CommentItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.6em 0;
  border-bottom: 1px solid #eee;
  font-size: 0.80em;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentAvatar = styled.img`
border: 1px solid #ccc;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
`;

// Blog is a FULL PAGE component, rendered only at the route "/blogs/:id"
// (see App.jsx). It is not used inside the blog list anymore - the list on
// "/" renders plain <Link>s directly, not <Blog> components. That's why this
// version no longer has a "view/hide" toggle: on its own dedicated page,
// there's nothing to collapse - everything should just be visible at once.
const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  // useNavigate gives us a function to programmatically change the URL,
  // e.g. after an action completes. Used below after a successful delete.
  const commentContent = useField("text");

  const { reset: resetComment, ...commentInputProps } = commentContent;
  const addComment = useBlogStore((state) => state.addComment);

  const navigate = useNavigate();

  const likeBlog = () => {
    handleLike(blog);
  };

  // Only the user who originally created this blog should see a delete
  // button. We compare usernames (not ids) because the logged-in `user`
  // object from login doesn't carry a mongo id, only username/name/token.
  const showDeleteButton = () => {
    if (!blog.user || !currentUser) {
      return false;
    }
    return blog.user.username === currentUser.username;
  };

  const deleteBlog = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      handleDelete(blog);
      // Redirect back to the blog list right after triggering the delete.
      // handleDelete is async and this call isn't awaited, so the redirect
      // fires while the DELETE request may still be in flight - that's
      // fine here since "/" doesn't depend on this specific blog existing.
      navigate("/");
    }
  };

  const onSubmitComment = (event) => {
    event.preventDefault();
    addComment(blog.id, commentInputProps.value);
    resetComment();
  };

  // Guards against rendering before `blog` is resolved. This happens on a
  // hard refresh of a "/blogs/:id" URL: React Router matches the route
  // instantly, but `blogs` (fetched via useEffect in App) may still be an
  // empty array for one render, so `blog` comes through as null/undefined
  // for a moment. Returning null avoids trying to read blog.title etc. on
  // something that doesn't exist yet.
  if (!blog) {
    return null;
  }

  return (
    <Card>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <LikeRow>
        likes {blog.likes}
        {/* Like button only shown to logged-in users (exercise 5.25
            requirement) - anonymous visitors can view but not like. */}
        {currentUser && <LikeButton onClick={likeBlog}>like</LikeButton>}
      </LikeRow>
      <p>{blog.user ? blog.user.name : ""}</p>
      {showDeleteButton() && (
        <RemoveButton onClick={deleteBlog}>remove</RemoveButton>
      )}
      <h3>Comments:</h3>

      <CommentForm onSubmit={onSubmitComment}>
        <CommentInput
          {...commentInputProps}
          placeholder="Add a comment"
          required
        />
        <CommentButton type="submit">Add Comment</CommentButton>
      </CommentForm>

      {blog.comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        <CommentList>
          {blog.comments.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentAvatar
                src={`https://api.dicebear.com/10.x/identicon/svg?seed=${comment.id}`}
                alt=""
              />
              {comment.content}
            </CommentItem>
          ))}
        </CommentList>
      )}
    </Card>
  );
};
export default Blog;
