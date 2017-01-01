import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  COMMON_TEST_1_BEGIN,
  COMMON_TEST_1_SUCCESS,
  COMMON_TEST_1_FAILURE,
  COMMON_TEST_1_DISMISS_ERROR,
} from 'src/features/common/redux/constants';

import {
  test1,
  dismissTest1Error,
  reducer,
} from 'src/features/common/redux/test1';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('common/redux/test1', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when test1 succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: COMMON_TEST_1_BEGIN },
      { type: COMMON_TEST_1_SUCCESS, data: {} },
    ];

    return store.dispatch(test1({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when test1 fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: COMMON_TEST_1_BEGIN },
      { type: COMMON_TEST_1_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(test1({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissTest1Error', () => {
    const expectedAction = {
      type: COMMON_TEST_1_DISMISS_ERROR,
    };
    expect(dismissTest1Error()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_1_BEGIN correctly', () => {
    const prevState = { test1Pending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_1_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test1Pending).to.be.true;
  });

  it('handles action type COMMON_TEST_1_SUCCESS correctly', () => {
    const prevState = { test1Pending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_1_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test1Pending).to.be.false;
  });

  it('handles action type COMMON_TEST_1_FAILURE correctly', () => {
    const prevState = { test1Pending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_1_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test1Pending).to.be.false;
    expect(state.test1Error).to.exist;
  });

  it('handles action type COMMON_TEST_1_DISMISS_ERROR correctly', () => {
    const prevState = { test1Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: COMMON_TEST_1_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.test1Error).to.be.null;
  });
});
