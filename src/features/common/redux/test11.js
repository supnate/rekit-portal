import {
  COMMON_TEST_11,
} from './constants';

export function test11() {
  return {
    type: COMMON_TEST_11,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_11:
      return {
        ...state,
      };

    default:
      return state;
  }
}
