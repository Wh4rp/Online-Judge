const jwt = require('jsonwebtoken')
const submissionsRouter = require('express').Router()
const Submission = require('../models/submission')
const Problem = require('../models/problem')
const User = require('../models/user')
const { checker } = require('../services/checker/checker')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

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

submissionsRouter.post('/', async (req, res, next) => {
    const body = req.body

    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const user = await User.findById(body.user_id)
    const problem = await Problem.findById(body.problem_id)

    const submission = new Submission({
        code: body.code,
        language: body.language,
        problem: problem._id,
        user: user._id,
        status: 'pending',
        verdicts: [],
        global_verdict: 'pending',
        time_execution: 0,
        memory_execution: 0,
    })

    const submissionSaved = await submission.save()
    user.submissions = user.submissions.concat(submissionSaved._id)
    await user.save()
    problem.submissions = problem.submissions.concat(submissionSaved._id)
    const savedSubmission = await problem.save()

    checker(savedSubmission, problem)
    res.json(savedSubmission)
})

module.exports = submissionsRouter