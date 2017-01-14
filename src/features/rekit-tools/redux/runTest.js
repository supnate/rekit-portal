import {
  REKIT_TOOLS_RUN_TEST_BEGIN,
  REKIT_TOOLS_RUN_TEST_SUCCESS,
  REKIT_TOOLS_RUN_TEST_FAILURE,
  REKIT_TOOLS_RUN_TEST_DISMISS_ERROR,
} from './constants';

export function runTest(args) {
  return (dispatch) => {
    dispatch({
      type: REKIT_TOOLS_RUN_TEST_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: REKIT_TOOLS_RUN_TEST_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: REKIT_TOOLS_RUN_TEST_FAILURE,
            data: {
              error: 'some error',
            },
          });
          reject();
        }
      }, 50);
    });

    return promise;
  };
}

export function dismissRunTestError() {
  return {
    type: REKIT_TOOLS_RUN_TEST_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_TOOLS_RUN_TEST_BEGIN:
      return {
        ...state,
        runTestPending: true,
        runTestError: null,
      };

    case REKIT_TOOLS_RUN_TEST_SUCCESS:
      return {
        ...state,
        runTestPending: false,
        runTestError: null,
      };

    case REKIT_TOOLS_RUN_TEST_FAILURE:
      return {
        ...state,
        runTestPending: false,
        runTestError: action.data.error,
      };

    case REKIT_TOOLS_RUN_TEST_DISMISS_ERROR:
      return {
        ...state,
        runTestError: null,
      };

    default:
      return state;
  }
}
