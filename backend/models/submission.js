const mongoose = require('mongoose')

// Define schema

const submissionSchema = new mongoose.Schema({
    id: Number,
    code: {
        type: String,
        required: [true, "Code is required"],
    },
    language: {
        type: String,
        enum: ['c', 'cpp', 'java', 'python'],
        required: [true, "Language is required"],
    },
    problem_slug: {
        type: String,
        required: [true, "Problem slug is required"],
    },
    status: {
        type: String,
        enum: ['pending', 'running', 'done'],
        required: [true, "Status is required"],
    },
    verdict: {
        enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'compilation_error', 'runtime_error'],
        type: String,
    },
    time_execution: {
        type: Number,
    },
    memory_execution: {
        type: Number,
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