import {
  COMMON_TESTC,
} from './constants';

export function testc() {
  return {
    type: COMMON_TESTC,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTC:
      return {
        ...state,
      };

    default:
      return state;
  }
}
