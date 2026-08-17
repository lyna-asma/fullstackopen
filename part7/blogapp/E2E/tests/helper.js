const loginWith = async (page, username, password) => {
    // Old version clicked a "login" button twice, because login used to be
    // hidden behind a toggle on the same page. Now /login is its own route,
    // so getting there means clicking the "login" LINK in the nav bar first.
    await page.getByRole('link', { name: 'login' }).click()

    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)

    // This part is unchanged: submitting still means clicking the button
    // labeled "login" inside the form itself.
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    // Old version clicked a button "create new blog" that popped a form
    // open inline. That button doesn't exist anymore - creating a blog now
    // means navigating to its own page via the "create new" LINK in the nav.
    await page.getByRole('link', { name: 'create new' }).click()

    await page.getByLabel('Title :').fill(title)
    await page.getByLabel('Url :').fill(url)
    await page.getByLabel('Author :').fill(author)
    await page.getByRole('button', { name: 'create' }).click()

    // After a successful submit, BlogForm redirects back to "/" on its own
    // (via navigate('/') inside BlogForm.jsx), so by the time this resolves
    // we're already back on the blog list.
    await page.getByText(`a new blog ${title}`).waitFor()
}

const likeBlog = async (page, title, expectedLikes) => {
    // Old version clicked a "view" button to expand the blog's row inline
    // in the list. That toggle is gone - liking a blog now means actually
    // navigating to that blog's own page first, by clicking its title link
    // in the list (the list only renders links, not full Blog components).
    await page.getByRole('link', { name: title }).click()

    await page.getByRole('button', { name: 'like' }).click()
    await page.getByText(`likes ${expectedLikes}`).waitFor()

    // Navigate back to the list so whatever runs next (another likeBlog
    // call, a page.reload(), etc.) starts from a known, consistent place.
    await page.getByRole('link', { name: 'blogs' }).click()
}

module.exports = { loginWith, createBlog, likeBlog }