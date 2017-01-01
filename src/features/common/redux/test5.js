import {
  COMMON_TEST_5,
} from './constants';

export function test5() {
  return {
    type: COMMON_TEST_5,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_5:
      return {
        ...state,
      };

    default:
      return state;
  }
}
