import {
  COMMON_TEST_23,
} from './constants';

export function test23() {
  return {
    type: COMMON_TEST_23,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_23:
      return {
        ...state,
      };

    default:
      return state;
  }
}
