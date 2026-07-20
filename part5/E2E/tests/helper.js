const loginWith = async (page, username, password) => {
    // retreivig the button based on its text
    await page.getByRole('button', { name: 'login' }).click()
    // the username gets entered first then password second , to avoid fail bcz we have 2 input feilds
    // it could have been done with : getAllByRole then accessing an array . or  getByText  ,  but labels are better , or even test_id if we have ones in our input feilds
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)

    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByLabel('Title :').fill(title)
    await page.getByLabel('Url :').fill(url)
    await page.getByLabel('Author :').fill(author)
    await page.getByRole('button', { name: 'create' }).click()
     await page.getByText(`a new blog ${title}`).waitFor()
}

const likeBlog = async (page, title, expectedLikes) => {
  const blogElement = page.locator('.blog', { hasText: title })
  const viewButton = blogElement.getByRole('button', { name: 'view' })

  // only click view if it's currently visible (not already expanded)
  if (await viewButton.isVisible()) {
    await viewButton.click()
  }

  await blogElement.getByRole('button', { name: 'like' }).click()
  await blogElement.getByText(`likes ${expectedLikes}`).waitFor()
}

module.exports = { loginWith, createBlog ,likeBlog  }