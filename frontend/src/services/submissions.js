import axios from 'axios'
const baseUrl = '/api/submissions'

let token = null
const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getByIdSubmission = async id => {
    const request = axios.get(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const getAllSubmissions = async () => {
    const request = axios.get(`${baseUrl}/`)
    return request.then(response => response.data)
}

const createSubmission = async newObject => {
    const config = {
        headers: { Authorization: token },
    }
    const request = axios.post(baseUrl, newObject, config)
    return request.then(response => response.data)
}

export { getByIdSubmission, getAllSubmissions, createSubmission, setToken }