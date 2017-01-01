import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  COMMON_TESTBC_BEGIN,
  COMMON_TESTBC_SUCCESS,
  COMMON_TESTBC_FAILURE,
  COMMON_TESTBC_DISMISS_ERROR,
} from 'src/features/common/redux/constants';

import {
  testbc,
  dismissTestbcError,
  reducer,
} from 'src/features/common/redux/testbc';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('common/redux/testbc', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when testbc succeeds', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: COMMON_TESTBC_BEGIN },
      { type: COMMON_TESTBC_SUCCESS, data: {} },
    ];

    return store.dispatch(testbc({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dispatches failure action when testbc fails', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: COMMON_TESTBC_BEGIN },
      { type: COMMON_TESTBC_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(testbc({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('returns correct action by dismissTestbcError', () => {
    const expectedAction = {
      type: COMMON_TESTBC_DISMISS_ERROR,
    };
    expect(dismissTestbcError()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTBC_BEGIN correctly', () => {
    const prevState = { testbcPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TESTBC_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.testbcPending).to.be.true;
  });

  it('handles action type COMMON_TESTBC_SUCCESS correctly', () => {
    const prevState = { testbcPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TESTBC_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.testbcPending).to.be.false;
  });

  it('handles action type COMMON_TESTBC_FAILURE correctly', () => {
    const prevState = { testbcPending: true };
    const state = reducer(
      prevState,
      { type: COMMON_TESTBC_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.testbcPending).to.be.false;
    expect(state.testbcError).to.exist;
  });

  it('handles action type COMMON_TESTBC_DISMISS_ERROR correctly', () => {
    const prevState = { testbcError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: COMMON_TESTBC_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.testbcError).to.be.null;
  });
});
