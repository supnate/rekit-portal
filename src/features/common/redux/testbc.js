import {
  COMMON_TESTBC_BEGIN,
  COMMON_TESTBC_SUCCESS,
  COMMON_TESTBC_FAILURE,
  COMMON_TESTBC_DISMISS_ERROR,
} from './constants';

export function testbc(args) {
  return (dispatch) => {
    dispatch({
      type: COMMON_TESTBC_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: COMMON_TESTBC_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: COMMON_TESTBC_FAILURE,
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

export function dismissTestbcError() {
  return {
    type: COMMON_TESTBC_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TESTBC_BEGIN:
      return {
        ...state,
        testbcPending: true,
        testbcError: null,
      };

    case COMMON_TESTBC_SUCCESS:
      return {
        ...state,
        testbcPending: false,
        testbcError: null,
      };

    case COMMON_TESTBC_FAILURE:
      return {
        ...state,
        testbcPending: false,
        testbcError: action.data.error,
      };

    case COMMON_TESTBC_DISMISS_ERROR:
      return {
        ...state,
        testbcError: null,
      };

    default:
      return state;
  }
}
