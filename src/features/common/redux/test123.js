import {
  COMMON_TEST_123,
} from './constants';

export function test123() {
  return {
    type: COMMON_TEST_123,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_123:
      return {
        ...state,
      };

    default:
      return state;
  }
}
