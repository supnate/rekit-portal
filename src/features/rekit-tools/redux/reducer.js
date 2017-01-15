import initialState from './initialState';
import { reducer as runTestReducer } from './runTest';
import { reducer as runBuildReducer } from './runBuild';

const reducers = [
  runTestReducer,
  runBuildReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
