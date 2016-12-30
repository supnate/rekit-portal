import axios from 'axios';
import {
  HOME_FETCH_NAV_TREE_DATA_BEGIN,
  HOME_FETCH_NAV_TREE_DATA_SUCCESS,
  HOME_FETCH_NAV_TREE_DATA_FAILURE,
  HOME_FETCH_NAV_TREE_DATA_DISMISS_ERROR,
} from './constants';

export function fetchNavTreeData() {
  return (dispatch) => {
    dispatch({
      type: HOME_FETCH_NAV_TREE_DATA_BEGIN,
    });
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/rekit/api/nav-tree-data');
        dispatch({
          type: HOME_FETCH_NAV_TREE_DATA_SUCCESS,
          data: res.data,
        });
        resolve(res.data);
      } catch (e) {
        dispatch({
          type: HOME_FETCH_NAV_TREE_DATA_FAILURE,
          data: e,
        });
        reject(e);
      }
    });

    return promise;
  };
}

export function dismissFetchNavTreeDataError() {
  return {
    type: HOME_FETCH_NAV_TREE_DATA_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_NAV_TREE_DATA_BEGIN:
      return {
        ...state,
        fetchNavTreeDataPending: true,
        fetchNavTreeDataError: null,
      };

    case HOME_FETCH_NAV_TREE_DATA_SUCCESS:

      return {
        ...state,
        featureById: action.data.features.reduce((prev, f) => {
          prev[f.key] = f; // eslint-disable-line
          return prev;
        }, {}),
        features: action.data.features.map(f => f.key),
        fetchNavTreeDataPending: false,
        fetchNavTreeDataError: null,
      };

    case HOME_FETCH_NAV_TREE_DATA_FAILURE:
      return {
        ...state,
        fetchNavTreeDataPending: false,
        fetchNavTreeDataError: action.data.error,
      };

    case HOME_FETCH_NAV_TREE_DATA_DISMISS_ERROR:
      return {
        ...state,
        fetchNavTreeDataError: null,
      };

    default:
      return state;
  }
}
