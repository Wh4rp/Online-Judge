var uniqueValidator = require('mongoose-unique-validator')
const mongoose = require('mongoose')

// Define problem schema

const problemSchema = new mongoose.Schema({
    id: Number,
    // Problem data for frontend
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
        maxlength: 20,
    },
    name_slug: {
        type: String,
        required: [true, "Name slug is required"],
        unique: true,
    },
    statement: {
        main: {
            type: String,
            required: [true, "Statement is required"],
            minlength: 10,
        },
        input: {
            type: String,
            required: [true, "Input is required"],
            minlength: 5,
        },
        output: {
            type: String,
            required: [true, "Output is required"],
            minlength: 5,
        },
        subtasks: [{
            score: Number,
            description: String,
        }],
        examples: {
            type: [
                {
                    id: {
                        type: Number,
                        required: [true, "Example id is required"],
                    },
                    input: {
                        type: String,
                        required: [true, "Example input is required"],
                    },
                    output: {
                        type: String,
                        required: [true, "Example output is required"],
                    },
                    explanation: {
                        type: String,
                    },
                }
            ],
            validate: v => v.length > 0,
            message: "At least one example is required",
            required: [true, "Examples are required"],
        }
    },
    has_subtasks: {
        type: Boolean,
        default: false,
    },
    subtasks_score: {
        type: [
            {
                id: {
                    type: Number,
                    required: [true, "Subtask id is required"],
                },
                score: {
                    type: Number,
                    required: [true, "Subtask score is required"],
                },
            }
        ],
    },
    time_limit: {
        type: Number,
        required: [true, "Time limit is required"],
    },
    memory_limit: {
        type: Number,
        required: [true, "Memory limit is required"],
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }],
    // Checker data for backend
    custom: {
        type: Boolean,
        default: false,
        required: [true, "Custom checker is required"],
    },
    checker: {
        type: String,
        default: "",
    },
    test_cases: {
        type: [
            {
                id: {
                    type: Number,
                    required: [true, "Test case id is required"],
                },
                name: {
                    type: String,
                    default: "",
                },
                type: {
                    type: String,
                    required: [true, "Test case type is required"],
                    enum: ['normal', 'subtask'],
                },
                subtask_id: {
                    type: Number,
                    default: 0,
                },
                input: {
                    type: String,
                    required: [true, "Test case input is required"],
                },
                output: {
                    type: String,
                    required: [true, "Test case output is required"],
                }
            }
        ],
        validate: v => v.length > 0,
        message: "At least one test case is required",
        required: [true, "Test cases are required"],
    }
})

// Transform to JSON and remove _id and __v

problemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.custom
        delete returnedObject.checker
    }
})

problemSchema.plugin(uniqueValidator)

// Export problem model

module.exports = mongoose.model('Problem', problemSchema)