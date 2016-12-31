import {
  REKIT_CMDS_SHOW_CMD_DIALOG,
} from './constants';

export function showCmdDialog(dialogType) {
  return {
    type: REKIT_CMDS_SHOW_CMD_DIALOG,
    data: { dialogType },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_CMDS_SHOW_CMD_DIALOG:
      return {
        ...state,
        [`${action.data.dialogType}DialogVisible`]: true,
      };

    default:
      return state;
  }
}
