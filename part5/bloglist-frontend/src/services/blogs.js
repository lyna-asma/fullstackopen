import axios from 'axios'
const baseUrl = '/api/blogs'

// for create 
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, newBlog, config)
  return request.then(response => response.data)
}

const update = (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return request.then(response => response.data)
}

const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

export default { getAll, create, update, remove, setToken }