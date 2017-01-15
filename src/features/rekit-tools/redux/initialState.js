const initialState = {
  runBuildPending: false,
  runBuildError: null,

  runBuildOutput: null,
  runBuildRunning: false, // the build process has started and has not finished.

  bgProcesses: {},
  runTestPending: false,
  runTestError: null,
  runTestOutput: null,
  runTestRunning: false, // the test process has started and has not finished.
};

export default initialState;
