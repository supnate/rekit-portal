import {
  COMMON_TEST_2_FE,
} from './constants';

export function test2Fe() {
  return {
    type: COMMON_TEST_2_FE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_2_FE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
