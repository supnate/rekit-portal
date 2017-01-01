import {
  COMMON_TESTCC,
} from './constants';

export function testcc() {
  return {
    type: COMMON_TESTCC,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTCC:
      return {
        ...state,
      };

    default:
      return state;
  }
}
