import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_NAV_TREE_DATA_BEGIN,
  HOME_FETCH_NAV_TREE_DATA_SUCCESS,
  HOME_FETCH_NAV_TREE_DATA_FAILURE,
  HOME_FETCH_NAV_TREE_DATA_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchNavTreeData,
  dismissFetchNavTreeDataError,
  reducer,
} from 'src/features/home/redux/fetchNavTreeData';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchNavTreeData', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchNavTreeData succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: HOME_FETCH_NAV_TREE_DATA_BEGIN },
      { type: HOME_FETCH_NAV_TREE_DATA_SUCCESS, data: {} },
    ];

    return store.dispatch(fetchNavTreeData({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when fetchNavTreeData fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: HOME_FETCH_NAV_TREE_DATA_BEGIN },
      { type: HOME_FETCH_NAV_TREE_DATA_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(fetchNavTreeData({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissFetchNavTreeDataError', () => {
    const expectedAction = {
      type: HOME_FETCH_NAV_TREE_DATA_DISMISS_ERROR,
    };
    expect(dismissFetchNavTreeDataError()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_FETCH_NAV_TREE_DATA_BEGIN correctly', () => {
    const prevState = { fetchNavTreeDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_NAV_TREE_DATA_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchNavTreeDataPending).to.be.true;
  });

  it('handles action type HOME_FETCH_NAV_TREE_DATA_SUCCESS correctly', () => {
    const prevState = { fetchNavTreeDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_NAV_TREE_DATA_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchNavTreeDataPending).to.be.false;
  });

  it('handles action type HOME_FETCH_NAV_TREE_DATA_FAILURE correctly', () => {
    const prevState = { fetchNavTreeDataPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_NAV_TREE_DATA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchNavTreeDataPending).to.be.false;
    expect(state.fetchNavTreeDataError).to.exist;
  });

  it('handles action type HOME_FETCH_NAV_TREE_DATA_DISMISS_ERROR correctly', () => {
    const prevState = { fetchNavTreeDataError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_NAV_TREE_DATA_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchNavTreeDataError).to.be.null;
  });
});
