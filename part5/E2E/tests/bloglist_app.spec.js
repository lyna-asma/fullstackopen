const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog , likeBlog } = require('./helper')

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
        const locator = await page.getByText('Login to application')
        await expect(locator).toBeVisible()

        await expect(page.getByLabel('username')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })


    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {

            // the username gets entered first then password second , to avoid fail bcz we have 2 input feilds
            // it could have been done with : getAllByRole then accessing an array . or  getByText  ,  but labels are better , or even test_id if we have ones in our input feilds
            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('salainen')

            await page.getByRole('button', { name: 'login' }).click()

            // now we can add expect bcz we actually entered info 
            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            // the username gets entered first then password second , to avoid fail bcz we have 2 input feilds
            // it could have been done with : getAllByRole then accessing an array . or  getByText  ,  but labels are better , or even test_id if we have ones in our input feilds
            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('wrong')

            await page.getByRole('button', { name: 'login' }).click()

            // now we can add expect bcz we actually entered info 
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

        test('user who added the blog can delete it', async ({ page }) => {
            await createBlog(page, 'Component testing is done with react-testing-library', 'Kent C. Dodds', 'http://example.com')

            const blogElement = page.locator('.blog', { hasText: 'Component testing is done with react-testing-library' })
            await blogElement.getByRole('button', { name: 'view' }).click()

            // Playwright auto-accepts the native window.confirm() dialog , thisis to be able to simulate an 
            // acception of the user to delete after that pop up shows up like in browser 
            page.on('dialog', dialog => dialog.accept())

            await blogElement.getByRole('button', { name: 'remove' }).click()
            await expect(page.locator('.blog', { hasText: 'Component testing is done with react-testing-library' })).not.toBeVisible()
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

            // reload so blogs re-fetch and re-sort from the backend, matching real usage
            await page.reload()

            const blogTitles = await page.locator('.blog').allTextContents()

            // Second (2 likes) should come before Third (1 like), which comes before First (0 likes)
            const secondIndex = blogTitles.findIndex(text => text.includes('Second blog'))
            const thirdIndex = blogTitles.findIndex(text => text.includes('Third blog'))
            const firstIndex = blogTitles.findIndex(text => text.includes('First blog'))

            expect(secondIndex).toBeLessThan(thirdIndex)
            expect(thirdIndex).toBeLessThan(firstIndex)
        })
    })



})