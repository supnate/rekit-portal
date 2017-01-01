import {
  COMMON_TESTABE,
} from './constants';

export function testabe() {
  return {
    type: COMMON_TESTABE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTABE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
