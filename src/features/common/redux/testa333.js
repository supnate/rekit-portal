import {
  COMMON_TESTA_333,
} from './constants';

export function testa333() {
  return {
    type: COMMON_TESTA_333,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTA_333:
      return {
        ...state,
      };

    default:
      return state;
  }
}
