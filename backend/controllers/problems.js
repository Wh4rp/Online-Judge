const problemsRouter = require('express').Router()
const Problem = require('../models/problem')

import { slugify } from '../helpers/slugify'
import { endline_tests } from '../helpers/endline_tests'

problemsRouter.get('/', async (req, res) => {
    const problems = await Problem.find({})
    console.log('problems', problems)
    res.json(problems)
})

problemsRouter.get('/:slug', async (req, res, next) => {
    const problem = await Problem.findOne({ 'name_slug': req.params.slug })
    if (problem === null) {
        return response.status(401).json({
            error: 'invalid problem name'
        })
    }
    res.json(problem)
})

problemsRouter.post('/', async (req, res, next) => {
    const body = req.body
    const name_slug = slugify(body.name)

    const problem = new Problem({
        ...body,
        name_slug: name_slug,
        statement: {
            ...body.statement,
            examples: endline_tests(body.statement.examples)
        },
        test_cases: endline_tests(body.test_cases)
    })

    const savedProblem = await problem.save()
    res.json(savedProblem)
})

problemsRouter.delete('/:slug', async (req, res, next) => {
    const problem = await Problem.findOne({ 'name_slug': req.params.name_slug })
    res.json(problem)
})

module.exports = problemsRouter