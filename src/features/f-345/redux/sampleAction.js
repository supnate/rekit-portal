import {
  F_345_SAMPLE_ACTION,
} from './constants';

export function sampleAction() {
  return {
    type: F_345_SAMPLE_ACTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case F_345_SAMPLE_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
