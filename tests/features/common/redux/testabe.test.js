import { expect } from 'chai';

import {
  COMMON_TESTABE,
} from 'src/features/common/redux/constants';

import {
  testabe,
  reducer,
} from 'src/features/common/redux/testabe';

describe('common/redux/testabe', () => {
  it('returns correct action by testabe', () => {
    const expectedAction = {
      type: COMMON_TESTABE,
    };
    expect(testabe()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTABE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTABE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
