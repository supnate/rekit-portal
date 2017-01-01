import { expect } from 'chai';

import {
  COMMON_TESTD,
} from 'src/features/common/redux/constants';

import {
  testd,
  reducer,
} from 'src/features/common/redux/testd';

describe('common/redux/testd', () => {
  it('returns correct action by testd', () => {
    const expectedAction = {
      type: COMMON_TESTD,
    };
    expect(testd()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTD }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
