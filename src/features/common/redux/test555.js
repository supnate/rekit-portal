import {
  COMMON_TEST_555_BEGIN,
  COMMON_TEST_555_SUCCESS,
  COMMON_TEST_555_FAILURE,
  COMMON_TEST_555_DISMISS_ERROR,
} from './constants';

export function test555(args) {
  return (dispatch) => {
    dispatch({
      type: COMMON_TEST_555_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: COMMON_TEST_555_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: COMMON_TEST_555_FAILURE,
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

export function dismissTest555Error() {
  return {
    type: COMMON_TEST_555_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_555_BEGIN:
      return {
        ...state,
        test555Pending: true,
        test555Error: null,
      };

    case COMMON_TEST_555_SUCCESS:
      return {
        ...state,
        test555Pending: false,
        test555Error: null,
      };

    case COMMON_TEST_555_FAILURE:
      return {
        ...state,
        test555Pending: false,
        test555Error: action.data.error,
      };

    case COMMON_TEST_555_DISMISS_ERROR:
      return {
        ...state,
        test555Error: null,
      };

    default:
      return state;
  }
}
