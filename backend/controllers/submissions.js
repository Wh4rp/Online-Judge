const submissionsRouter = require('express').Router()
const Submission = require('../models/submission')
const Problem = require('../models/problem')
const { checker } = require('../services/checker/checker')

submissionsRouter.get('/', (req, res) => {
    Submission.find({}).sort({ submission_time: -1 }).then(submissions => {
        res.json(submissions)
    })
})

submissionsRouter.get('/:id', (req, res, next) => {
    Submission.findById(req.params.id)
        .then(submission => {
            if (submission) {
                res.json(submission)
            } else {
                res.status(404).end()
            }
        })
})

submissionsRouter.post('/', (req, res, next) => {
    const body = req.body

    const submission = new Submission({
        code: body.code,
        language: body.language,
        problem_slug: body.problem_slug,
        problem_title: body.problem_title,
        status: 'pending',
        verdicts: [],
        global_verdict: 'pending',
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