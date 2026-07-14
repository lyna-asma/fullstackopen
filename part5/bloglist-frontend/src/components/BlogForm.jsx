const BlogForm = ({ addBlog, title, author, url, handleUrl, handleAuthor, handleTitle }) => (
    <form onSubmit={addBlog}>
        <h2>Create New Blog :</h2>
        <label >
            Title :
            <input value={title} onChange={handleTitle} />
        </label>
        <label >
            Url :
            <input value={url} onChange={handleUrl} />
        </label>
        <label >
            Author :
            <input value={author} onChange={handleAuthor} />
        </label>
        <button type="submit">create</button>
    </form>
)

export default BlogForm