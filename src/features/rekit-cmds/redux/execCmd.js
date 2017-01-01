import _ from 'lodash';
import axios from 'axios';
import {
  REKIT_CMDS_EXEC_CMD_BEGIN,
  REKIT_CMDS_EXEC_CMD_SUCCESS,
  REKIT_CMDS_EXEC_CMD_FAILURE,
  REKIT_CMDS_EXEC_CMD_DISMISS_ERROR,
} from './constants';

const logs = {
  'add-action': { title: 'Add action success', description: 'See below logs for what has been done:' },
};

export function execCmd(args) {
  return (dispatch) => {
    dispatch({
      type: REKIT_CMDS_EXEC_CMD_BEGIN,
    });
    const promise = new Promise(async (resolve, reject) => {
      let res = null;
      try {
        res = await axios.post('/rekit/api/exec-cmd', args);
      } catch (e) {
        dispatch({
          type: REKIT_CMDS_EXEC_CMD_FAILURE,
          data: { error: _.get(e, 'response.data') || e.message || e },
        });
        reject(e);
        return;
      }
      dispatch({
        type: REKIT_CMDS_EXEC_CMD_SUCCESS,
        data: { logs: res.data, args },
      });
      resolve(res.data);
    });

    return promise;
  };
}

export function dismissExecCmdError() {
  return {
    type: REKIT_CMDS_EXEC_CMD_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_CMDS_EXEC_CMD_BEGIN:
      return {
        ...state,
        execCmdPending: true,
        execCmdError: null,
      };

    case REKIT_CMDS_EXEC_CMD_SUCCESS:
      return {
        ...state,
        cmdLogs: action.data.logs,
        logsTitle: logs[action.data.args.type].title,
        logsDescription: logs[action.data.args.type].description,
        execCmdPending: false,
        execCmdError: null,
      };

    case REKIT_CMDS_EXEC_CMD_FAILURE:
      return {
        ...state,
        execCmdPending: false,
        execCmdError: action.data.error,
      };

    case REKIT_CMDS_EXEC_CMD_DISMISS_ERROR:
      return {
        ...state,
        execCmdError: null,
      };

    default:
      return state;
  }
}
