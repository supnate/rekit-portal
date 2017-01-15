const initialState = {
  runBuildPending: false,
  runBuildError: null,

  runBuildOutput: null,
  runBuildRunning: false, // the build process has started and has not finished.

  bgProcesses: {},
};

export default initialState;
