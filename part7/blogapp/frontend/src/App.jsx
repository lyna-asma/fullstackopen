import { useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useMatch,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import useNotificationStore from "./stores/notificationStore";
import useUserStore from "./stores/userStore";
import useBlogStore from "./stores/blogStore";
import useUserListStore from "./stores/userListStore";
import User from "./components/User";
import UsersList from "./components/UsersList";

const Page = styled.div`
  padding: 1em 2em;
  max-width: 700px;
  margin: 0 auto;
`;

const Navigation = styled.div`
  background: #34495e;
  padding: 0.75em 1em;
  border-radius: 4px;
  margin-bottom: 1em;

  a {
    color: white;
    text-decoration: none;
    margin-right: 1em;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }

  span {
    color: #dcdde1;
    float: right;
  }
`;

const LogoutButton = styled.button`
  background: #e55039;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
   font-weight: 500;

  &:hover {
    background: #c8402e;
  }
`;

const AvatarSmall = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 0.5em;
`;

// NOTE: there is NO <Router> here. The <Router> (BrowserRouter) lives in
// main.jsx, wrapping <App />. Why: React Router's useMatch hook (used below)
// cannot be called inside the same component that defines the <Routes>/<Route>
// tree it's matching against - it needs to sit "outside" that tree, which
// means Router has to be a level above App, not inside App.
// If you put a second <Router> here too, you get NESTED routers, which React
// Router does not support and will misbehave / throw.

const App = () => {
  // ---- STATE ----
  // App is the single owner of all shared state: the blog list, the logged-in user, the login form fields, and the notification banner.
  // // Every route below is just a different "view" onto this same state - none of the child components (Blog, BlogForm, LoginForm) keep their own copy of it.
  //reading localStorage is synchronous, so it belongs in the state initializer, not an effect that fires after the first paint

  // ................ ALL SECTION MOVED TO STORE VERSION OF STATES  IE ZUSTAND ...........................................
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const blogs = useBlogStore((state) => state.blogs); // should already be there from 7.12
  const likeBlog = useBlogStore((state) => state.likeBlog);
  const deleteBlog = useBlogStore((state) => state.deleteBlog);

  // smethods from stores
  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  );
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs);
  const createBlog = useBlogStore((state) => state.createBlog);

  // useNavigate() has to be called inside a component that's rendered BELOW the <Router> in main.jsx - and  App is exactly like that - so this works fine here.
  const navigate = useNavigate();

  // Fetch all blogs once when the app first mounts (empty dependency array).
  // after implementing the blogStore this becomes via the store s innitializer, no direct communication to the service
  // Why is useeffect parameter array have the function initializeBlogs?
  // because the function is defined outside of the useEffect,
  //  and it is a dependency of the useEffect
  //  so it needs to be included in the dependency array to ensure that the effect is re-run whenever the function changes.
  // This is a common pattern in React to avoid stale closures and ensure that the effect always has access to the latest version of the function.
  useEffect(() => {
    initializeBlogs();
  }, [initializeBlogs]);

  // Re-attach the user's token to the blogService module whenever `user` changes (on mount if one was found above, and again after a fresh login),
  // so authenticated requests (create/update/delete) carry the right token.
  // This is a genuine effect — it's syncing an external module, not computing state — unlike the localStorage read above.

  // ........................ MOVED THE EFFCECT TO THE STORE VERSION OF THE USER STATE .................................

  // ---- LOGIN / LOGOUT ----
  const handleLogin = async (username, password) => {
    try {
      await login({ username, password });
      // No explicit navigate() call is needed here: once `user` becomes
      // truthy, the "/login" route below re-renders and its own element
      // becomes <Navigate replace to="/" />, which redirects automatically.
    } catch (error) {
      console.log(
        "LOGIN ERROR:",
        error.response?.status,
        error.response?.data,
        error.message,
      );
      setNotification("wrong credentials", "error");
    }
  };

  const handleLogout = () => {
    logout();
    // Imperative navigate, same category as addBlog/deleteBlog: logging out
    // is a one-time reaction to this click, not something a route ternary
    // is already checking for elsewhere - so there's no "free" declarative
    // redirect to piggyback on the way there was for handleLogin.
    navigate("/");
  };

  // ---- BLOG CRUD ----
  // addBlog is passed down to BlogForm as the `createBlog` prop. BlogForm
  // itself calls navigate('/') after this resolves, redirecting the user
  // back to the blog list - that redirect logic lives in BlogForm.jsx, not
  // here, because BlogForm is the component that's actually rendered on the
  // "/create" route and has access to useNavigate there.
  const addBlog = async (blogObject) => {
    try {
      await createBlog(blogObject);
      setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        "success",
      );
    } catch (error) {
      console.error(error);
      setNotification(
        "something went wrong while creating the blog ....",
        "error",
      );
    }
  };

  // handleLike is passed to Blog as the `handleLike` prop. It sends the
  // FULL updated blog object to the backend (PUT expects title/author/url
  // too, not just the incremented like count).
  const handleLike = async (blogToUpdate) => {
    try {
      await likeBlog(blogToUpdate);
    } catch {
      setNotification("Failed to update likes", "error");
    }
  };

  // handleDelete is passed to Blog as the `handleDelete` prop. Blog itself
  // calls navigate('/') right after calling this, redirecting the user back
  // to the list once deletion is triggered.
  const handleDelete = async (blogToDelete) => {
    try {
      await deleteBlog(blogToDelete);
      setNotification(
        `Blog "${blogToDelete.title}" deleted successfully`,
        "success",
      );
    } catch {
      setNotification("Failed to delete blog", "error");
    }
  };

  //useMatch checks the browser's current URL against the pattern /blogs/:id. If the current URL looks like that pattern (e.g. /blogs/6a91e4fcd32e82cca196ec26),
  // it returns an object containing the parts that matched — specifically match.params.id
  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  // SAME APPLIES FOR USERS <SINGLE USER PAGE
  const userMatch = useMatch("/users/:id");
  const userListState = useUserListStore((state) => state.users);
  const singleUser = userMatch
    ? userListState.find((u) => u.id === userMatch.params.id)
    : null;

  return (
    <Page>
      {/* Navigation bar: <Link> changes the URL without a full page reload.
          It's conditional on `user` so logged-out visitors only see "login",
          while logged-in visitors see "create new" and a logout button. */}
      <Navigation>
        <Link to="/">blogs</Link>
        {user ? (
          <>
            <Link to="/create">create new</Link>

            <Link to="/users">users</Link>
            <span>
              <AvatarSmall
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                alt={user.name}
              />
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </span>
          </>
        ) : (
          <Link to="/login">login</Link>
        )}
      </Navigation>

      <Notification />

      {/* <Routes> picks exactly ONE <Route> to render based on the current
          URL, matching top to bottom. Everything else on screen (nav bar,
          notification) stays mounted regardless of route. */}
      <ErrorBoundary resetKeys={[blogs]}>
        <Routes>
          {/* If already logged in, redirect away from /login instead of
            showing the form again. <Navigate> is React Router's way of
            doing a redirect from inside a route's element. */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate replace to="/" />
              ) : (
                <LoginForm handleLogin={handleLogin} />
              )
            }
          />

          {/* Route guard: only logged-in users may reach /create. Anyone else
            gets bounced to /login. */}
          <Route
            path="/create"
            element={
              !user ? (
                <Navigate replace to="/login" />
              ) : (
                <BlogForm createBlog={addBlog} />
              )
            }
          />

          {/* Parameterized route. React Router extracts the :id part of the
            URL and (via useMatch above) we look up the matching blog and
            pass just THAT blog down - Blog never has to search the array
            itself. */}
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                currentUser={user}
              />
            }
          />

          {/* Root route: the full blog list, sorted by likes descending.
            BlogList is the direct equivalent of the course's NoteList - the
            only structural difference from the notes app is that the blog
            app has no separate "Home" page: "/" IS the list. */}
          <Route path="/" element={<BlogList blogs={blogs} />} />

          <Route
            path="/users"
            element={
              user ? (
                <UsersList />
              ) : (
                <Notification
                  message="Please log in to view users"
                  type="error"
                />
              )
            }
          />

          <Route path="/users/:id" element={<User user={singleUser} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Page>
  );
};

export default App;
