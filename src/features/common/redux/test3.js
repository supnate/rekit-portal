import {
  COMMON_TEST_3,
} from './constants';

export function test3() {
  return {
    type: COMMON_TEST_3,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_3:
      return {
        ...state,
      };

    default:
      return state;
  }
}
