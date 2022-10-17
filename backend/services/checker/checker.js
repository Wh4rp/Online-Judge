const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const runTestCase = async (run_command, custom, language_checker) => {
    const run_test = await new Promise((resolve, reject) => {
        const command = `${run_command} <./services/checker/tmp/test_cases/input.txt >./services/checker/tmp/test_cases/output.txt`
        exec(command, (err, stdout, stderr) => {
            if (err) {
                resolve({
                    status: 'error',
                    message: err.message
                })
            }
            else {
                resolve({
                    status: 'success',
                    message: 'Test case ran successfully'
                })
            }
        })
    })

    if (run_test.status === 'error') {
        return {
            verdict: 'Runtime Error',
            time_execution: 0,
            memory_execution: 0,
        }
    }
    else {
        if (!custom) {
            return await checkTestCase()
        } else {
            return await checkTestCaseCustom(language_checker)
        }
    }

}

const checkTestCase = async () => {
    const output = await fs.readFileSync('./services/checker/tmp/test_cases/output.txt', 'utf8')
    const output_expected = await fs.readFileSync('./services/checker/tmp/test_cases/output_expected.txt', 'utf8')

    if (output === output_expected) {
        return {
            verdict: 'AC',
            time_execution: 0,
            memory_execution: 0,
        }
    } else {
        return {
            verdict: 'WA',
            time_execution: 0,
            memory_execution: 0,
        }
    }
}

const checkTestCaseCustom = async (language_checker) => {
    if (language_checker === 'cpp') {
        return await checkTestCaseCustom_cpp()
    }
    if (language_checker === 'python') {
        return await checkTestCaseCustom_python()
    }
}

const checkTestCaseCustom_cpp = async () => {
    const command = `g++ custom_checker.cpp -o custom_checker`
    exec(command, (err, stdout, stderr) => {
        if (err) {
            return {
                status: 'error',
                message: err
            }
        }
        else {
            return {
                status: 'success',
                message: 'Test case ran successfully'
            }
        }
    })
        .then(() => {
            command = `./custom_checker test_case_output_expected.txt test_case_output.txt > verdict.txt`
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    return {
                        status: 'error',
                        message: err
                    }
                }
                else {
                    let verdict = fs.readFileSync('verdict.txt', 'utf8')
                    if (verdict === 'AC') {
                        return {
                            verdict: 'AC',
                            time_execution: 0,
                            memory_execution: 0,
                        }
                    } else {
                        return {
                            verdict: 'WA',
                            time_execution: 0,
                            memory_execution: 0,
                        }
                    }
                }
            })
        })
}

const checkTestCaseCustom_python = async () => {
    let command = `python custom_checker.py test_case_output_expected.txt test_case_output.txt > verdict.txt`
    exec(command, (err, stdout, stderr) => {
        if (err) {
            return {
                status: 'error',
                message: err
            }
        }
        else {
            let verdict = fs.readFileSync('verdict.txt', 'utf8')
            if (verdict === 'AC') {
                return {
                    verdict: 'AC',
                    time_execution: 0,
                    memory_execution: 0,
                }
            } else {
                return {
                    verdict: 'WA',
                    time_execution: 0,
                    memory_execution: 0,
                }
            }
        }
    })
}

const checkSubmission = async (run_command, custom, checker, test_cases) => {
    let verdicts = []
    let id = 0
    for (const test_case of test_cases) {
        await fs.writeFileSync('./services/checker/tmp/test_cases/input.txt', test_case.input)
        await fs.writeFileSync('./services/checker/tmp/test_cases/output_expected.txt', test_case.output)
        const verdict = await runTestCase(run_command, custom, checker, test_case, id)
        verdict.id = id
        id += 1
        verdicts.push(verdict)
    }
    return verdicts
}

const checker_cpp = async (submission, problem) => {
    // Get submission data
    const code = submission.code

    // Save code in run.cpp
    await fs.writeFileSync('./services/checker/tmp/run.cpp', code)

    // Compile submitted code
    const compiled = await new Promise((resolve, reject) => {
        const command = `g++ ./services/checker/tmp/run.cpp -o ./services/checker/tmp/run.out`
        exec(command, (err, stdout, stderr) => {
            if (err) {
                resolve({
                    success: false,
                    error: stderr,
                })
            } else {
                resolve({
                    success: true,
                })
            }
        })
    })

    // If compilation failed, return compilation error
    if (!compiled.success) {
        return [{
            verdict: "compilation_error",
            error: compiled.error,
        }]
    }
    // If compilation succeeded

    // Get checker data
    const custom = problem.checker.custom
    const checker = problem.checker.checker
    const test_cases = problem.checker.test_cases

    // Create run command
    const command = `./services/checker/tmp/run.out`

    // Run each test case
    const verdict = await checkSubmission(command, custom, checker, test_cases)
    return verdict
}

const checker_python = async (submission, problem) => {
    // Get submission data
    const code = submission.code

    // Save code in run.py
    await fs.writeFileSync('./services/checker/tmp/run.py', code)

    // Create run command
    const command = `python ./services/checker/tmp/run.py`

    // Get checker data
    const custom = problem.checker.custom
    const checker = problem.checker.checker
    const test_cases = problem.checker.test_cases

    // Run each test case
    const verdict = await checkSubmission(command, custom, checker, test_cases)
    return verdict
}

async function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const global_verdict = (verdicts) => {
    let verdict = 'solved'
    for (const v of verdicts) {
        if (v.verdict === 'compilation_error') {
            verdict = 'compilation_error'
            break
        }
        if (v.verdict !== 'AC') {
            verdict = 'failed'
            break
        }
    }
    return verdict
}

const checker = async (submission, problem) => {
    // Get submission language data
    const language = submission.language
    let verdicts = []
    if (language === 'cpp') {
        verdicts = await checker_cpp(submission, problem)
    }
    if (language === 'python') {
        verdicts = await checker_python(submission, problem)
    }
    submission.verdicts = verdicts
    submission.global_verdict = global_verdict(verdicts)
    submission.status = 'done'
    submission.save()
    return submission
}

module.exports = {
    checker,
}