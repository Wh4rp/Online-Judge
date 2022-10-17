const problemsRouter = require('express').Router()
const Problem = require('../models/problem')

problemsRouter.get('/', (req, res) => {
    Problem.find({}).then(problems => {
        res.json(problems.map(problem => problem.data)) // Only return data field
    })
})

problemsRouter.get('/:slug', (req, res, next) => {
    Problem.findOne({ "data.title_slug": req.params.slug })
        .then(problem => {
            if (problem) {
                console.log(problem.data)
                res.json(problem.data) // Only return data field
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

problemsRouter.post('/', (req, res, next) => {
    console.log('req.body', req.body)
    const data = req.body.data
    const checker = req.body.checker
    const title_slug = data.title  // Slugify title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()

    if (Problem.findOne({ "data.title_slug": title_slug }).length > 0) {
        console.log('title_slug', title_slug)
        return res.status(400).json({ error: "Problem already exists" })
    }

    const problem = new Problem({
        data: {
            ...data,
            title_slug: title_slug
        },
        checker: checker
    })

    problem.save()
        .then(savedProblem => {
            console.log('Saved new problem: ', savedProblem.data.title)
            res.json(savedProblem)
        })
        .catch(error => next(error))
})

problemsRouter.delete('/:title_slug', (req, res, next) => {
    Problem.findOneAndRemove({ "data.title_slug": req.params.title_slug })
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = problemsRouter