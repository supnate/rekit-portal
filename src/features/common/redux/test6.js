import {
  COMMON_TEST_6,
} from './constants';

export function test6() {
  return {
    type: COMMON_TEST_6,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_6:
      return {
        ...state,
      };

    default:
      return state;
  }
}
