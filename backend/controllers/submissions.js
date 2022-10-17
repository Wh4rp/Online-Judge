const submissionsRouter = require('express').Router()
const Submission = require('../models/submission')

submissionsRouter.get('/', (req, res) => {
    Submission.find({}).then(submissions => {
        res.json(submissions)
    })
})

submissionsRouter.get('/:id', (req, res, next) => {
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

submissionsRouter.post('/', (req, res, next) => {
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

module.exports = submissionsRouter