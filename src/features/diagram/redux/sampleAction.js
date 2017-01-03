import {
  DIAGRAM_SAMPLE_ACTION,
} from './constants';

export function sampleAction() {
  return {
    type: DIAGRAM_SAMPLE_ACTION,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case DIAGRAM_SAMPLE_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}
