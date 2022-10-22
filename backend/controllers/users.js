const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('submissions', { id: 1, verdict: 1, problem: 1, time: 1, memory: 1 })
    res.json(users)
})

userRouter.get('/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).populate('submissions', { id: 1, verdict: 1, problem: 1, time: 1, memory: 1 })
    if(user === null) {
        return res.status(401).json({
            error: 'invalid username'
        })
    }
    res.json(user)
})

userRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = userRouter