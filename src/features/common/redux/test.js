import {
  COMMON_TEST,
} from './constants';

export function test() {
  return {
    type: COMMON_TEST,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST:
      return {
        ...state,
      };

    default:
      return state;
  }
}
