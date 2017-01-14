import {
  REKIT_TOOLS_RUN_BUILD_BEGIN,
  REKIT_TOOLS_RUN_BUILD_SUCCESS,
  REKIT_TOOLS_RUN_BUILD_FAILURE,
  REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR,
} from './constants';

export function runBuild(args) {
  return (dispatch) => {
    dispatch({
      type: REKIT_TOOLS_RUN_BUILD_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: REKIT_TOOLS_RUN_BUILD_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: REKIT_TOOLS_RUN_BUILD_FAILURE,
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

export function dismissRunBuildError() {
  return {
    type: REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REKIT_TOOLS_RUN_BUILD_BEGIN:
      return {
        ...state,
        runBuildPending: true,
        runBuildError: null,
      };

    case REKIT_TOOLS_RUN_BUILD_SUCCESS:
      return {
        ...state,
        runBuildPending: false,
        runBuildError: null,
      };

    case REKIT_TOOLS_RUN_BUILD_FAILURE:
      return {
        ...state,
        runBuildPending: false,
        runBuildError: action.data.error,
      };

    case REKIT_TOOLS_RUN_BUILD_DISMISS_ERROR:
      return {
        ...state,
        runBuildError: null,
      };

    default:
      return state;
  }
}
