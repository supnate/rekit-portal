import {
  REKIT_CMDS_SHOW_LOG_VIEWER_DIALOG,
} from './constants';

export function showLogViewerDialog() {
  return {
    type: REKIT_CMDS_SHOW_LOG_VIEWER_DIALOG,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_CMDS_SHOW_LOG_VIEWER_DIALOG:
      return {
        ...state,
      };

    default:
      return state;
  }
}
