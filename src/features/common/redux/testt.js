import {
  COMMON_TESTT,
} from './constants';

export function testt() {
  return {
    type: COMMON_TESTT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
