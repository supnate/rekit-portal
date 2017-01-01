import { expect } from 'chai';

import {
  COMMON_TEST_23,
} from 'src/features/common/redux/constants';

import {
  test23,
  reducer,
} from 'src/features/common/redux/test23';

describe('common/redux/test23', () => {
  it('returns correct action by test23', () => {
    const expectedAction = {
      type: COMMON_TEST_23,
    };
    expect(test23()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_23 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_23 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
