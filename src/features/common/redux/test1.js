import {
  COMMON_TEST_1_BEGIN,
  COMMON_TEST_1_SUCCESS,
  COMMON_TEST_1_FAILURE,
  COMMON_TEST_1_DISMISS_ERROR,
} from './constants';

export function test1(args) {
  return (dispatch) => {
    dispatch({
      type: COMMON_TEST_1_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: COMMON_TEST_1_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: COMMON_TEST_1_FAILURE,
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

export function dismissTest1Error() {
  return {
    type: COMMON_TEST_1_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case COMMON_TEST_1_BEGIN:
      return {
        ...state,
        test1Pending: true,
        test1Error: null,
      };

    case COMMON_TEST_1_SUCCESS:
      return {
        ...state,
        test1Pending: false,
        test1Error: null,
      };

    case COMMON_TEST_1_FAILURE:
      return {
        ...state,
        test1Pending: false,
        test1Error: action.data.error,
      };

    case COMMON_TEST_1_DISMISS_ERROR:
      return {
        ...state,
        test1Error: null,
      };

    default:
      return state;
  }
}
