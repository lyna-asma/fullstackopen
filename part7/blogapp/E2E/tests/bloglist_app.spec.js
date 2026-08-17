const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        // emptying the DB
        await request.post('/api/testing/reset')
        // creating a new user
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        // Old version checked this right on page load, because the app now we need this 
        await page.getByRole('link', { name: 'login' }).click()

        const locator = await page.getByText('Login to application')
        await expect(locator).toBeVisible()

        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('link', { name: 'login' }).click()

            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('link', { name: 'login' }).click()

            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('wrong credentials')).toBeVisible()
            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Component testing is done with react-testing-library', 'Kent C. Dodds', 'http://example.com')

            await expect(page.getByText('Component testing is done with react-testing-library').first()).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'test blog', 'tester', 'http://test.com')

            // Old version checked "1 likes" right on the list page, because
            // the list used to render each blog's like count inline. The
            // list only shows title+author links now - the like count only
            // exists on the blog's own page, so we have to go there first.
            await page.getByRole('link', { name: 'test blog' }).click()
            await page.getByRole('button', { name: 'like' }).click()

            // Also note the word order: Blog.jsx renders "likes {n}", not
            // "{n} likes" - the old assertion had it backwards for this app.
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('user who added the blog can delete it', async ({ page }) => {
            await createBlog(page, 'Component testing is done with react-testing-library', 'Kent C. Dodds', 'http://example.com')

            // Old version clicked "view" to expand the row first. Now we
            // navigate to the blog's own page by clicking its title link.
            await page.getByRole('link', { name: 'Component testing is done with react-testing-library' }).click()

            // Playwright auto-accepts the native window.confirm() dialog
            // Blog.jsx pops up before actually deleting.
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()

            // Blog.jsx calls navigate('/') right after triggering the
            // delete, so we end up back on the list - confirm the deleted
            // blog's link is gone from it.
            await expect(page.getByRole('link', { name: 'Component testing is done with react-testing-library' })).not.toBeVisible()
        })

        test('blogs are ordered by likes, most liked first', async ({ page }) => {
            await createBlog(page, 'First blog', 'Author One', 'http://example.com/1')
            await createBlog(page, 'Second blog', 'Author Two', 'http://example.com/2')
            await createBlog(page, 'Third blog', 'Author Three', 'http://example.com/3')

            // give 'Second blog' the most likes
            await likeBlog(page, 'Second blog', 1)
            await likeBlog(page, 'Second blog', 2)

            // give 'Third blog' one like
            await likeBlog(page, 'Third blog', 1)

            // 'First blog' stays at 0 likes

            await page.reload()
            await page.locator('.blog').first().waitFor()

            const blogTitles = await page.locator('.blog').allTextContents()

            // Old version split on ", written by" because Blog.jsx used to
            // render that exact phrase. BlogList.jsx now renders links as
            // "{title} by {author}" (no comma) - so the split pattern has
            // to match "by" instead.
            const cleanedTitles = blogTitles.map(text => {
                const match = text.match(/^(.*) by /)
                return match ? match[1].trim() : text
            })

            expect(cleanedTitles[0]).toContain('Second blog')
            expect(cleanedTitles[1]).toContain('Third blog')
            expect(cleanedTitles[2]).toContain('First blog')
        })
    })
})