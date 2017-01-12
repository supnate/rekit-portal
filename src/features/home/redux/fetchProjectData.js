import axios from 'axios';
import {
  HOME_FETCH_PROJECT_DATA_BEGIN,
  HOME_FETCH_PROJECT_DATA_SUCCESS,
  HOME_FETCH_PROJECT_DATA_FAILURE,
  HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
} from './constants';

export function fetchProjectData() {
  return (dispatch) => {
    dispatch({
      type: HOME_FETCH_PROJECT_DATA_BEGIN,
    });

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/rekit/api/project-data');
        dispatch({
          type: HOME_FETCH_PROJECT_DATA_SUCCESS,
          data: res.data,
        });
        resolve(res.data);
      } catch (e) {
        dispatch({
          type: HOME_FETCH_PROJECT_DATA_FAILURE,
          data: { error: e },
        });
        reject(e);
      }
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

    case HOME_FETCH_PROJECT_DATA_SUCCESS: {
      const featureById = {};
      const elementById = {};

      const setElementById = (ele) => {
        if (ele.children) {
          // Only applies to misc
          ele.children.forEach(setElementById);
        } else {
          elementById[ele.file] = ele;
        }
      };
      action.data.features.forEach((f) => {
        featureById[f.key] = f;
        elementById[f.key] = f;
        [...f.components, ...f.actions, ...f.misc].forEach(setElementById);
      });

      return {
        ...state,
        // projectData: action.data,
        elementById,
        featureById,
        projectRoot: action.data.projectRoot,
        cssExt: action.data.cssExt,
        fileContentById: {},
        features: action.data.features.map(f => f.key),
        projectDataNeedReload: false,
        fetchProjectDataPending: false,
        fetchProjectDataError: null,
      };
    }
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
