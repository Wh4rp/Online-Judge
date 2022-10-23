import axios from 'axios'

const baseUrl = '/api/problems'

const getAllProblems = async () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getBySlugProblem = async (slug) => {
    const request = axios.get(`${baseUrl}/${slug}`)
    return request.then(response => response.data)
}

const createProblem = async newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const updateProblem = async (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const deleteProblem = async (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request
}

export { getAllProblems, getBySlugProblem, createProblem, updateProblem, deleteProblem }