const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const PATH = './services/checker/tmp'

const is_memory_exceeded = (stderr) => {
    const python_memory_exceeded = stderr.match(/MemoryError/)
    const cpp_memory_exceeded = stderr.match(/Killed/)
    return python_memory_exceeded || cpp_memory_exceeded
}

async function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const compile_cpp = async (file) => {
    const command = `g++ ${PATH}/${file} -o ${PATH}/${file.split('.')[0]}.exe`
    return new Promise(function (resolve, reject) {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                resolve({
                    success: false,
                    error: stderr,
                })
            } else {
                console.log('Compiled')
                resolve({
                    success: true,
                    command: `${PATH}/${file.split('.')[0]}.exe`
                })
            }
        })
    })
}

// This will dockerize in the future

const runTestCase = async (run_command, time_limit, memory_limit) => {
    // Run submitted code
    const command = `ulimit -v ${memory_limit * 1000}; /usr/bin/time -f "%K" -o ${PATH}/test_case/memory_execution.data ${run_command} < ${PATH}/test_case/test_case.in > ${PATH}/test_case/test_case.out`
    console.log('Running ', command)
    time_start = performance.now()
    return new Promise(function (resolve, reject) {
        exec(command, {
            timeout: time_limit * 1000,
        }, (err, stdout, stderr) => {
            time_end = performance.now()
            time_execution = time_end - time_start
            const data_execution = {
                time_execution: time_execution,
                memory_execution: fs.readFileSync(`${PATH}/test_case/memory_execution.data`, 'utf8')
            }
            if (err) {
                if (err.signal === 'SIGTERM') {
                    resolve({
                        ...data_execution,
                        status: 'error',
                        verdict: "TLE",
                        message: stderr,
                    })
                }
                if (is_memory_exceeded(stderr)) {
                    resolve({
                        ...data_execution,
                        status: 'error',
                        verdict: "MLE",
                        message: stderr,
                    })
                }
                resolve({
                    ...data_execution,
                    status: 'error',
                    verdict: "runtime error",
                    message: stderr,
                })
            }
            else {
                resolve({
                    ...data_execution,
                    status: 'success',
                })
            }
        })
    })
}

const checkTestCase = async (checker_command) => {
    const command = `${checker_command} ${PATH}/test_case/test_case.in ${PATH}/test_case/test_case.out ${PATH}/test_case/test_case.sol`
    console.log('Running ', command)
    return new Promise(function (resolve, reject) {
        exec(command, (err, stdout, stderr) => {
            console.log('stderr:', stderr)
            console.log('type stderr:', typeof stderr)
            if (err) {
                resolve({
                    verdict: "WA",
                    message: stderr,
                })
            } else {
                resolve({
                    verdict: "AC",
                    message: stderr,
                })
            }
        })
    })
}

const checkSubmission = async (run_command, checker_command, test_cases, time_limit, memory_limit) => {
    let verdicts = []
    let id = 0
    for (const test_case of test_cases) {
        await fs.writeFileSync(`${PATH}/test_case/test_case.in`, test_case.input)
        await fs.writeFileSync(`${PATH}/test_case/test_case.sol`, test_case.output)
        console.log('Running test case vs input')
        const run_verdict = await runTestCase(run_command, time_limit, memory_limit)
        if (run_verdict.status === 'error') {
            verdicts.push({
                id: id,
                verdict: run_verdict.verdict,
                message: run_verdict.message,
                time_execution: run_verdict.time_execution,
                memory_execution: run_verdict.memory_execution,
            })
            id += 1
            continue
        }
        await sleep(2)
        console.log('Running test case vs correct output')
        const verdict = await checkTestCase(checker_command)
        verdicts.push({
            ...run_verdict,
            ...verdict,
            id: id,
        })
        await sleep(2)
        id += 1
    }
    return verdicts
}

const global_verdict = (verdicts) => {
    let verdict = 'solved'
    for (const v of verdicts) {
        if (v.verdict !== 'AC') {
            verdict = 'failed'
            break
        }
    }
    return verdict
}

const checker = async (submission, problem) => {
    console.log('Init checker')

    await sleep(2)

    // Get submission language data
    const language = submission.language
    console.log('language', language)

    await sleep(2)

    let compiled = {}

    // Get run command
    let run_command = ''
    if (language === 'cpp') {
        await fs.writeFileSync(`${PATH}/run.cpp`, submission.code)
        console.log('compiling...')
        compiled = await compile_cpp('run.cpp')
        await sleep(2)
        if (!compiled.success) {
            console.log('Compilation error')
            submission.status = 'done'
            submission.global_verdict = 'compilation error'
            submission.verdicts = [{
                id: 0,
                verdict: 'compilation error',
                message: compiled.error,
                time_execution: 0,
                memory_execution: 0,
            }]
            submission.save()
            return submission
        }
        else {
            console.log('Compilation success')
            run_command = compiled.command
        }
    }
    if (language === 'python') {
        await fs.writeFileSync(`${PATH}/run.py`, submission.code)
        run_command = `python ${PATH}/run.py`
    }

    console.log('run_command', run_command)

    // Compile checker
    let checker_command = ''
    if (problem.custom) {
        await fs.writeFileSync(`${PATH}/custom_checker.cpp`, problem.checker)
        compiled = await compile_cpp('custom_checker.cpp')
        checker_command = compiled.command
    } else {
        compiled = await compile_cpp('default_checker.cpp')
        checker_command = compiled.command
    }

    console.log('checker_command', checker_command)

    await sleep(2)

    time_limit = problem.time_limit
    memory_limit = problem.memory_limit

    const verdicts = await checkSubmission(run_command, checker_command, problem.test_cases, time_limit, memory_limit)

    console.log('verdicts', verdicts)

    await sleep(2)

    submission.verdicts = verdicts
    submission.global_verdict = global_verdict(verdicts)
    submission.status = 'done'


    if (problem.has_subtasks) {
        console.log('Getting subtask scores')
        await sleep(2)
        let score_subtasks = []
        let score_global = 0

        for (const subtask of problem.subtasks) {
            let score = 0
            let max_score = 0
            let subtask_verdict = 'solved'
            for (const id of subtask.test_cases) {
                max_score += problem.test_cases[id].score
                if (verdicts[id].verdict === 'AC') {
                    score += problem.test_cases[id].score
                }
                else {
                    subtask_verdict = 'failed'
                }
            }
            score_global += score
            score_subtasks.push({
                id: subtask.id,
                verdict: subtask_verdict,
                score: subtask_verdict === 'solved' ? subtask.score : score,
                max_score: max_score,
            })
        }
        submission.score_subtasks = score_subtasks
        submission.score_global = score_global
        console.log('submission.score_subtasks', submission.score_subtasks)
        console.log('submission.score_global', submission.score_global)
    }

    console.log('submission.global_verdict', submission.global_verdict)
    submission.save()
    return submission
}

module.exports = {
    checker,
}

// Test
const submission = {
    code: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    language: 'cpp',
}

const submission_compiled_error = {
    code: `#include <iostream>
using namespace std;
int main() {
    a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    language: 'cpp',
}


const problem_normal = {
    has_subtasks: false,
    time_limit: 1,
    memory_limit: 256,
    custom_checker: false,
    test_cases: [
        {
            id: 0,
            name: 'test case 1',
            type: 'normal',
            input: '1 2',
            output: '3',
        }
    ]
}

const problem_subtask = {
    has_subtasks: true,
    subtasks: [
        {
            id: 0,
            score: 20,
            test_cases: [0],
        },
        {
            id: 1,
            score: 30,
            test_cases: [1],
        },
        {
            id: 2,
            score: 50,
            test_cases: [2],
        }
    ],
    time_limit: 1,
    memory_limit: 256,
    custom_checker: false,
    test_cases: [
        {
            id: 0,
            name: 'test case 1',
            type: 'subtask',
            subtask_id: 0,
            score: 20,
            input: '1 2',
            output: '3',
        },
        {
            id: 1,
            name: 'test case 2',
            type: 'subtask',
            subtask_id: 1,
            score: 30,
            input: '3 2',
            output: '5',
        },
        {
            id: 2,
            name: 'test case 3',
            type: 'subtask',
            subtask_id: 2,
            score: 50,
            input: '4 2',
            output: '6',
        }
    ]
}

// Run checker
checker(submission_compiled_error, problem_subtask)