import {
  HOME_FETCH_PROJECT_DATA_BEGIN,
  HOME_FETCH_PROJECT_DATA_SUCCESS,
  HOME_FETCH_PROJECT_DATA_FAILURE,
  HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
} from './constants';

export function fetchProjectData(args) {
  return (dispatch) => {
    dispatch({
      type: HOME_FETCH_PROJECT_DATA_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (args && !args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: HOME_FETCH_PROJECT_DATA_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: HOME_FETCH_PROJECT_DATA_FAILURE,
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

export function dismissFetchProjectDataError() {
  return {
    type: HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_PROJECT_DATA_BEGIN:
      return {
        ...state,
        fetchProjectDataPending: true,
        fetchProjectDataError: null,
      };

    case HOME_FETCH_PROJECT_DATA_SUCCESS:
      return {
        ...state,
        fetchProjectDataPending: false,
        fetchProjectDataError: null,
      };

    case HOME_FETCH_PROJECT_DATA_FAILURE:
      return {
        ...state,
        fetchProjectDataPending: false,
        fetchProjectDataError: action.data.error,
      };

    case HOME_FETCH_PROJECT_DATA_DISMISS_ERROR:
      return {
        ...state,
        fetchProjectDataError: null,
      };

    default:
      return state;
  }
}
