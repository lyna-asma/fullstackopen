import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const nonExistingPerson= {
    name :"Bob" , number : "22" , id : "1000" 
  }
  const request = axios.get(baseUrl)
  return request.then(response => response.data.concat(nonExistingPerson))
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update , remove}