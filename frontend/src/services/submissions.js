import axios from 'axios'

const baseUrl = '/api/submissions'

const getAllSubmissions = async () => {
    const request = axios.get(`${baseUrl}/`)
    return request.then(response => response.data)
}

const createSubmission = async newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

export { getAllSubmissions, createSubmission }