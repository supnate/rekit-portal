import initialState from './initialState';
import { reducer as showCmdDialog } from './showCmdDialog';
import { reducer as hideCmdDialog } from './hideCmdDialog';

const reducers = [
  showCmdDialog,
  hideCmdDialog,
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
