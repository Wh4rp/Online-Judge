require("dotenv").config() // Load environment variables from .env file

// Import modules

const express = require('express')
const app = express()
const checker = require('./checker/checker')

// Import models

require("./models/mongodb") // Connect to MongoDB
const Problem = require("./models/problem")
const Submission = require("./models/submission")

// Add several middleware to app

const cors = require("cors")
app.use(cors())

const morgan = require("morgan")
morgan.token("data", function (req, res) { return JSON.stringify(req.body) })
const logger = morgan(":method :url :status :res[content-length] - :response-time ms :data")
app.use(logger)

app.use(express.json())
app.use(express.static("./dist"))

// Define routes

app.get('/api', (req, res) => {
    res.send('API is working!')
})

// Problems requests

app.get('/api/problems', (req, res) => {
    Problem.find({}).then(problems => {
        res.json(problems.map(problem => problem.data)) // Only return data field
    })
})

app.get('/api/problems/:slug', (req, res, next) => {
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

app.post('/api/problems', (req, res, next) => {
    console.log('req.body', req.body)
    const data = req.body.data
    const checker = req.body.checker
    const title_slug = data.title  // Slugify title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

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

app.delete('/api/problems/:title_slug', (req, res, next) => {
    Problem.findOneAndRemove({ "data.title_slug": req.params.title_slug })
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// Submissions requests

app.get('/api/submissions', (req, res) => {
    Submission.find({}).then(submissions => {
        res.json(submissions)
    })
})

app.get('/api/submissions/:id', (req, res, next) => {
    Submission.findOne({ id: req.params.id })
        .then(submission => {
            if (submission) {
                res.json(submission)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/submissions', (req, res, next) => {
    const body = req.body

    const submission = new Submission({
        code: body.code,
        language: body.language,
        problem_slug: body.problem_slug,
        status: "pending",
        verdict: "pending",
        time_execution: 0,
        memory_execution: 0,
    })

    const problem = Problem.findOne({ "data.title_slug": body.problem_slug })

    if (!problem) {
        return res.status(400).json({ error: "Problem does not exist" })
    }

    submission.save()
        .then(savedSubmission => {
            console.log('Saved new submission: ', savedSubmission.id)
            checker.check(savedSubmission, problem)
            res.json(savedSubmission)
        })
        .catch(error => next(error))
})

// Handle errors with middleware

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" })
    }
    else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

// Start server

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Example app listening on ${port} port!`)
})
