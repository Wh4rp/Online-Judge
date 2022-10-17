const mongoose = require('mongoose')

// Define schema

const submissionSchema = new mongoose.Schema({
    id: {
        type: String
    },
    code: {
        type: String,
        required: [true, "Code is required"],
    },
    language: {
        type: String,
        enum: ['c', 'cpp', 'java', 'python'],
        required: [true, "Language is required"],
    },
    problem_title: {
        type: String,
        required: [true, "Problem title is required"],
    },
    problem_slug: {
        type: String,
        required: [true, "Problem slug is required"],
    },
    checker: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'running', 'done'],
        required: [true, "Status is required"],
    },
    verdicts: {
        type: [
            {
                id: {
                    type: Number,
                    required: [true, "Verdict id is required"],
                },
                verdict: {
                    type: String,
                    enum: ['pending', 'AC', 'WA', 'time_limit_exceeded', 'compilation error', 'runtime error'],
                    required: [true, "Verdict is required"],
                },
                time_execution: {
                    type: Number,
                    required: [true, "Time execution is required"],
                },
                memory_execution: {
                    type: Number,
                    required: [true, "Memory execution is required"],
                },
            }
        ],
    },
    global_verdict: {
        type: String,
        enum: ['pending', 'compilation error', 'solved', 'failed'],
        required: [true, "Global verdict is required"],
    },
    time_execution: {
        type: Number,
    },
    memory_execution: {
        type: Number,
    },
    submission_time: {
        type: Date,
        default: Date.now,
    },
})

// Transform to JSON and remove _id and __v

submissionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Export submission model

module.exports = mongoose.model('Submission', submissionSchema)