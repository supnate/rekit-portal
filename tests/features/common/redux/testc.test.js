import { expect } from 'chai';

import {
  COMMON_TESTC,
} from 'src/features/common/redux/constants';

import {
  testc,
  reducer,
} from 'src/features/common/redux/testc';

describe('common/redux/testc', () => {
  it('returns correct action by testc', () => {
    const expectedAction = {
      type: COMMON_TESTC,
    };
    expect(testc()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTC correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTC }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
