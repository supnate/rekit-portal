import initialState from './initialState';
import { reducer as runBuildReducer } from './runBuild';

const reducers = [
  runBuildReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case 'REKIT_PORTAL_OUTPUT':
      if (action.data.type === 'build') {
        return {
          ...state,
          runBuildOutput: [...state.runBuildOutput || [], ...action.data.output],
        };
      }
      break;
    case 'REKIT_TOOLS_BUILD_FINISHED':
      return {
        ...state,
        runBuildRunning: false,
      };
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
