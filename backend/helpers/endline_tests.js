const endline_tests = (test_cases) => {
    return test_cases.map(test_case => {
        return {
            id: test_case.id,
            input: test_case.input.endsWith('\n') ? test_case.input : test_case.input + '\n',
            output: test_case.output.endsWith('\n') ? test_case.output : test_case.output + '\n'
        }
    })
}

module.exports = endline_tests