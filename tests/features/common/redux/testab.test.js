import { expect } from 'chai';

import {
  COMMON_TESTAB,
} from 'src/features/common/redux/constants';

import {
  testab,
  reducer,
} from 'src/features/common/redux/testab';

describe('common/redux/testab', () => {
  it('returns correct action by testab', () => {
    const expectedAction = {
      type: COMMON_TESTAB,
    };
    expect(testab()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTAB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTAB }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
