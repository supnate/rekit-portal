import _ from 'lodash';
import initialState from './initialState';
import { reducer as runBuildReducer } from './runBuild';

import { HOME_FETCH_PROJECT_DATA_SUCCESS } from '../../home/redux/constants';

const reducers = [
  runBuildReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case HOME_FETCH_PROJECT_DATA_SUCCESS:
      return {
        ...state,
        runBuildRunning: !!_.get(action.data, 'bgProcesses.runningBuild'),
      };
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
