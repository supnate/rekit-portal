import { expect } from 'chai';

import {
  COMMON_TESTABSD,
} from 'src/features/common/redux/constants';

import {
  testabsd,
  reducer,
} from 'src/features/common/redux/testabsd';

describe('common/redux/testabsd', () => {
  it('returns correct action by testabsd', () => {
    const expectedAction = {
      type: COMMON_TESTABSD,
    };
    expect(testabsd()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTABSD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTABSD }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
