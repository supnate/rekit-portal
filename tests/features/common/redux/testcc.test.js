import { expect } from 'chai';

import {
  COMMON_TESTCC,
} from 'src/features/common/redux/constants';

import {
  testcc,
  reducer,
} from 'src/features/common/redux/testcc';

describe('common/redux/testcc', () => {
  it('returns correct action by testcc', () => {
    const expectedAction = {
      type: COMMON_TESTCC,
    };
    expect(testcc()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTCC correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTCC }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
