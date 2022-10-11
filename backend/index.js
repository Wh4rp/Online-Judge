require("dotenv").config()
const express = require('express')
const app = express()
const Problem = require("./models/problem")

const cors = require("cors")
app.use(cors())

const morgan = require("morgan")
morgan.token("data", function (req, res) { return JSON.stringify(req.body) })
const logger = morgan(":method :url :status :res[content-length] - :response-time ms :data")
app.use(logger)

app.use(express.json())
app.use(express.static("./dist"))

app.get('/api', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/problems', (req, res) => {
    Problem.find({}).then(problems => {
        res.json(problems)
    })
})

app.get('/api/problems/:id', (req, res, next) => {
    Problem.findById(req.params.id)
        .then(problem => {
            if (problem) {
                res.json(problem)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/problems', (req, res, next) => {
    const body = req.body

    const problem = new Problem({
        title: body.title,
        description: body.description,
        input: body.input,
        output: body.output,
        examples: body.examples,
        difficulty: body.difficulty,
        tags: body.tags,
        timelimit: body.timelimit,
        memorylimit: body.memorylimit
    })

    problem.save()
        .then(savedProblem => {
            res.json(savedProblem)
        })
        .catch(error => next(error))
})

app.delete('/api/problems/:id', (req, res, next) => {
    Problem.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

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

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Example app listening on ${port} port!`)
})
