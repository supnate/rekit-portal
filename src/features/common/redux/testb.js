import {
  COMMON_TESTB,
} from './constants';

export function testb() {
  return {
    type: COMMON_TESTB,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTB:
      return {
        ...state,
      };

    default:
      return state;
  }
}
