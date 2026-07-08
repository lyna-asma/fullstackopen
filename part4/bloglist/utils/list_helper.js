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



module.exports = {
  dummy ,
  totalLikes
}