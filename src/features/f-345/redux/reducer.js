import initialState from './initialState';
import { reducer as sampleActionReducer } from './sampleAction';

const reducers = [
  sampleActionReducer,
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
