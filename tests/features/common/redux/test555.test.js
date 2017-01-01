import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  COMMON_TEST_555_BEGIN,
  COMMON_TEST_555_SUCCESS,
  COMMON_TEST_555_FAILURE,
  COMMON_TEST_555_DISMISS_ERROR,
} from 'src/features/common/redux/constants';

import {
  test555,
  dismissTest555Error,
  reducer,
} from 'src/features/common/redux/test555';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('common/redux/test555', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when test555 succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: COMMON_TEST_555_BEGIN },
      { type: COMMON_TEST_555_SUCCESS, data: {} },
    ];

    return store.dispatch(test555({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when test555 fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: COMMON_TEST_555_BEGIN },
      { type: COMMON_TEST_555_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(test555({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissTest555Error', () => {
    const expectedAction = {
      type: COMMON_TEST_555_DISMISS_ERROR,
    };
    expect(dismissTest555Error()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_555_BEGIN correctly', () => {
    const prevState = { test555Pending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_555_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test555Pending).to.be.true;
  });

  it('handles action type COMMON_TEST_555_SUCCESS correctly', () => {
    const prevState = { test555Pending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_555_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test555Pending).to.be.false;
  });

  it('handles action type COMMON_TEST_555_FAILURE correctly', () => {
    const prevState = { test555Pending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_555_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test555Pending).to.be.false;
    expect(state.test555Error).to.exist;
  });

  it('handles action type COMMON_TEST_555_DISMISS_ERROR correctly', () => {
    const prevState = { test555Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_555_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test555Error).to.be.null;
  });
});
