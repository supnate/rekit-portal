import {
  COMMON_TESTD,
} from './constants';

export function testd() {
  return {
    type: COMMON_TESTD,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTD:
      return {
        ...state,
      };

    default:
      return state;
  }
}
