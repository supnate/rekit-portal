import { expect } from 'chai';

import {
  COMMON_TEST_3,
} from 'src/features/common/redux/constants';

import {
  test3,
  reducer,
} from 'src/features/common/redux/test3';

describe('common/redux/test3', () => {
  it('returns correct action by test3', () => {
    const expectedAction = {
      type: COMMON_TEST_3,
    };
    expect(test3()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_3 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_3 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
