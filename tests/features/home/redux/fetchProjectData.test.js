import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_PROJECT_DATA_BEGIN,
  HOME_FETCH_PROJECT_DATA_SUCCESS,
  HOME_FETCH_PROJECT_DATA_FAILURE,
  HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchProjectData,
  dismissFetchProjectDataError,
  reducer,
} from 'src/features/home/redux/fetchProjectData';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchProjectData', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchProjectData succeeds', () => {
    nock('http://localhost:6078/')
      .get('/rekit/api/project-data')
      .reply(200, { data: { features: [] } });
    const store = mockStore({});

    const expectedActions = [
      { type: HOME_FETCH_PROJECT_DATA_BEGIN },
      { type: HOME_FETCH_PROJECT_DATA_SUCCESS, data: {} },
    ];

    return store.dispatch(fetchProjectData())
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when fetchProjectData fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: HOME_FETCH_PROJECT_DATA_BEGIN },
      { type: HOME_FETCH_PROJECT_DATA_FAILURE, data: { error: {} } },
    ];

    return store.dispatch(fetchProjectData({}))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissFetchProjectDataError', () => {
    const expectedAction = {
      type: HOME_FETCH_PROJECT_DATA_DISMISS_ERROR,
    };
    expect(dismissFetchProjectDataError()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_BEGIN correctly', () => {
    const prevState = { fetchProjectDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataPending).to.be.true;
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_SUCCESS correctly', () => {
    const prevState = { fetchProjectDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_SUCCESS, data: { features: [] } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataPending).to.be.false;
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_FAILURE correctly', () => {
    const prevState = { fetchProjectDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataPending).to.be.false;
    expect(state.fetchProjectDataError).to.exist;
  });

  it('handles action type HOME_FETCH_PROJECT_DATA_DISMISS_ERROR correctly', () => {
    const prevState = { fetchProjectDataError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_PROJECT_DATA_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchProjectDataError).to.be.null;
  });
});
