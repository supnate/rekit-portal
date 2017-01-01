import {
  COMMON_TESTE,
} from './constants';

export function teste() {
  return {
    type: COMMON_TESTE,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
