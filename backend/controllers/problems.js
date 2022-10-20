const problemsRouter = require('express').Router()
const Problem = require('../models/problem')

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
    const name_slug = body.name  // Slugify name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()

    const problem = new Problem({
        ...body,
        name_slug: name_slug,
        statement: {
            ...body.statement,
            examples: body.statement.examples.map(example => {
                return {
                    id: example.id,
                    input: example.input.endsWith('\n') ? example.input : example.input + '\n',
                    output: example.output.endsWith('\n') ? example.output : example.output + '\n'
                }
            })
        },
        test_cases: body.test_cases.map(test_case => {
            return {
                id: test_case.id,
                input: test_case.input.endsWith('\n') ? test_case.input : test_case.input + '\n',
                output: test_case.output.endsWith('\n') ? test_case.output : test_case.output + '\n'
            }
        })
    })

    const savedProblem = await problem.save()
    res.json(savedProblem)
})

problemsRouter.delete('/:slug', async (req, res, next) => {
    const problem = await Problem.findOne({ 'name_slug': req.params.name_slug })
    res.json(problem)
})

module.exports = problemsRouter