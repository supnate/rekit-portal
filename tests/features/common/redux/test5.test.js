import { expect } from 'chai';

import {
  COMMON_TEST_5,
} from 'src/features/common/redux/constants';

import {
  test5,
  reducer,
} from 'src/features/common/redux/test5';

describe('common/redux/test5', () => {
  it('returns correct action by test5', () => {
    const expectedAction = {
      type: COMMON_TEST_5,
    };
    expect(test5()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_5 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_5 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
