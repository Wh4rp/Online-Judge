const mongoose = require('mongoose')

// Connect to MongoDB

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

// Define schema

const problemSchema = new mongoose.Schema({
    id: Number,
    // Problem data for frontend
    data: {
        title: {
            type: String,
            required: [true, "Title is required"],
            minlength: 3,
            maxlength: 20,
        },
        title_slug: {
            type: String,
            required: [true, "Title slug is required"],
        },
        statement: {
            main: {
                type: String,
                required: [true, "Statement is required"],
            },
            input: {
                type: String,
                required: [true, "Input is required"],
            },
            output: {
                type: String,
                required: [true, "Output is required"],
            },
            examples:{
                type: [
                    {
                        id : {
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
                    }
                ],
                validate: v => v.length > 0,
                message: "At least one example is required",
                required: [true, "Examples are required"],
            }
            ,
        },
        time_limit: {
            type: Number,
            required: [true, "Time limit is required"],
        },
        memory_limit: {
            type: Number,
            required: [true, "Memory limit is required"],
        }
    },
    // Checker data for backend
    checker: {
        custom: {
            type: Boolean,
            required: [true, "Custom checker is required"],
            default: false,
        },
        checker: {
            type: String,
            default: "",
        },
        test_cases: {
            type: [
                {
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
    }
})

// Transform to JSON and remove _id and __v

problemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Define model

module.exports = mongoose.model('Problem', problemSchema)