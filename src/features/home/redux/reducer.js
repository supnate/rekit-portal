import initialState from './initialState';
import { reducer as fetchProjectData } from './fetchProjectData';
import { reducer as fetchFileContent } from './fetchFileContent';

const reducers = [
  fetchProjectData,
  fetchFileContent,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    case 'PROJECT_FILE_CHANGED':
      newState = {
        ...state,
        projectDataNeedReload: true,
      };
      break;
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
