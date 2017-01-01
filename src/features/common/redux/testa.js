import {
  COMMON_TESTA,
} from './constants';

export function testa() {
  return {
    type: COMMON_TESTA,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTA:
      return {
        ...state,
      };

    default:
      return state;
  }
}
