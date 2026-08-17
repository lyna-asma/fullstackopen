// functions to be tested 
//  functions that are best suited for working with the describe sections of the blog list

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum,blog)=> sum + blog.likes , 0)
}


const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
}


const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
// creating an empty likes by aithor object 
  const likesByAuthor = {}
  blogs.forEach(blog => {
    // checking the former value of likes per aithor before updating it
    // using dynamic feid keys makes the object format not knwon beforehand
    likesByAuthor[blog.author] = /* "does this author already have a running total stored? If yes, get it. If no, we get undefined, so || 0 gives us a starting point of 0.*/ (likesByAuthor[blog.author] || 0) + blog.likes
  })

  const topAuthor = Object.keys(likesByAuthor).reduce((top, author) =>
    likesByAuthor[author] > likesByAuthor[top] ? author : top
  )

  return {
    author: topAuthor,
    likes: likesByAuthor[topAuthor]
  }
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const countsByAuthor = {}
  blogs.forEach(blog => {
    countsByAuthor[blog.author] = (countsByAuthor[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(countsByAuthor).reduce((top, author) =>
    countsByAuthor[author] > countsByAuthor[top] ? author : top
  )

  return {
    author: topAuthor,
    blogs: countsByAuthor[topAuthor]
  }
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs
}