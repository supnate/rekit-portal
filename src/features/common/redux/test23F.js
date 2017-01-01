import {
  COMMON_TEST_23_F,
} from './constants';

export function test23F() {
  return {
    type: COMMON_TEST_23_F,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_23_F:
      return {
        ...state,
      };

    default:
      return state;
  }
}
