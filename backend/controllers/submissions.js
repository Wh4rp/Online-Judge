const submissionsRouter = require('express').Router()
const Submission = require('../models/submission')
const Problem = require('../models/problem')
const { checker } = require('../services/checker/checker')

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
        status: 'pending',
        verdicts: [],
        time_execution: 0,
        memory_execution: 0,
    })

    Problem.findOne({ "data.title_slug": body.problem_slug }, (err, problem) => {
        if (err) {
            console.log(err)
        } else {
            if (problem) {
                submission.save()
                    .then(savedSubmission => {
                        console.log('Saved new submission: ', savedSubmission)
                        console.log('problem', problem)
                        checker(savedSubmission, problem)
                        res.json(savedSubmission)
                    })
                    .catch(error => next(error))
            }
        }
    })
})

module.exports = submissionsRouter