import initialState from './initialState';
import { reducer as counterPlusOne } from './counterPlusOne';
import { reducer as counterMinusOne } from './counterMinusOne';
import { reducer as resetCounter } from './resetCounter';
import { reducer as fetchRedditReactjsList } from './fetchRedditReactjsList';
import { reducer as fetchNavTreeData } from './fetchNavTreeData';
import { reducer as fetchProjectData } from './fetchProjectData';

const reducers = [
  counterPlusOne,
  counterMinusOne,
  resetCounter,
  fetchRedditReactjsList,
  fetchNavTreeData,
  fetchProjectData,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Put global reducers here
    case 'PROJECT_FILE_CHANGED':
      newState = {
        ...state,
        navTreeDataNeedReload: true,
      };
      break;
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
