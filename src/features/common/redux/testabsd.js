import {
  COMMON_TESTABSD,
} from './constants';

export function testabsd() {
  return {
    type: COMMON_TESTABSD,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTABSD:
      return {
        ...state,
      };

    default:
      return state;
  }
}
