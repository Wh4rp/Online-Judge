const problemsRouter = require('express').Router()
const Problem = require('../models/problem')

problemsRouter.get('/', async (req, res) => {
    const problems = await Problem.find({})
    res.json(problems.map(problem => problem.data))
})

problemsRouter.get('/:slug', async (req, res, next) => {
    const problem = await Problem.findOne({ 'data.name_slug': req.params.slug })
    if (problem === null) {
        return response.status(401).json({
            error: 'invalid problem name'
        })
    }
    res.json(problem.data)
})

problemsRouter.post('/', async (req, res, next) => {
    const data = req.body.data
    const checker = req.body.checker
    const name_slug = data.name  // Slugify name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()

    const problem = new Problem({
        data: {
            ...data,
            name_slug: name_slug
        },
        checker: checker
    })

    const savedProblem = await problem.save()
    res.json(savedProblem.data)
})

problemsRouter.delete('/:slug', async (req, res, next) => {
    const problem = await Problem.findOne({ 'data.name_slug': req.params.name_slug })
    res.json(problem)
})

module.exports = problemsRouter