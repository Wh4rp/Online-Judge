import axios from 'axios'

const baseUrl = '/api/problems'

const getAll = async () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getById = async (id) => {
    const request = axios.get(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const create = async newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = async (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const deleteObject = async (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request
}

export { getAll, getById, create, update, deleteObject }