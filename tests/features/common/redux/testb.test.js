import { expect } from 'chai';

import {
  COMMON_TESTB,
} from 'src/features/common/redux/constants';

import {
  testb,
  reducer,
} from 'src/features/common/redux/testb';

describe('common/redux/testb', () => {
  it('returns correct action by testb', () => {
    const expectedAction = {
      type: COMMON_TESTB,
    };
    expect(testb()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTB correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTB }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
