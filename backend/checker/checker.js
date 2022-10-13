const checker = (submission, problem) => {
    
    // Get submission data
    const code = submission.code
    const language = submission.language
    
    // Get checker data
    const custom = problem.checker.custom
    const checker = problem.checker.checker
    const test_cases = problem.checker.test_cases
    
    // Compile submission
    const compiled = compile(code, language)
    
    // If compilation failed, return compilation error
    if (!compiled.success) {
        return {
            verdict: "compilation_error",
            time_execution: 0,
            memory_execution: 0,
        }
    }
    
    // If compilation succeeded, run submission
    const run = execute(compiled, language)
    
    // If execution failed, return runtime error
    if (!run.success) {
        return {
            verdict: "runtime_error",
            time_execution: 0,
            memory_execution: 0,
        }
    }
    
    // If execution succeeded, check submission
    const check = checkSubmission(run, custom, checker, test_cases)
    
    // Return check result
    return check
}

export default checker