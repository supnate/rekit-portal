import {
  COMMON_TESTAB,
} from './constants';

export function testab() {
  return {
    type: COMMON_TESTAB,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTAB:
      return {
        ...state,
      };

    default:
      return state;
  }
}
