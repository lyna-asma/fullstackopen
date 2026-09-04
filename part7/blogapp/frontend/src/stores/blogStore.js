import { create } from 'zustand';
import blogService from '../services/blogs';

const useBlogStore = create((set, get) => ({
  blogs: [],
  initializeBlogs: async () => {
    const blogs = await blogService.getAll();
    set({ blogs });
  },

  // why aync and how this works in background?
  createBlog: async (blogObject) => {
    const newBlog = await blogService.create(blogObject);
    set({ blogs: get().blogs.concat(newBlog) });
  },
likeBlog: async (blogToUpdate) => {
  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
    user: blogToUpdate.user?.id || blogToUpdate.user,
  };
  const returnedBlog = await blogService.update(blogToUpdate.id, updatedBlog);
  set({
    blogs: get().blogs.map((blog) => (blog.id !== returnedBlog.id ? blog : returnedBlog)),
  });
},
addComment: async (blogId, content) => {
  const newComment = await blogService.addComment(blogId, content)
  set({
    blogs: get().blogs.map((blog) =>
      blog.id !== blogId ? blog : { ...blog, comments: blog.comments.concat(newComment) }
    ),
  })
},
deleteBlog: async (blogToDelete) => {
  await blogService.remove(blogToDelete.id);
  set({ blogs: get().blogs.filter((blog) => blog.id !== blogToDelete.id) });
},
}));

export default useBlogStore;