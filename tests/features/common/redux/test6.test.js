import { expect } from 'chai';

import {
  COMMON_TEST_6,
} from 'src/features/common/redux/constants';

import {
  test6,
  reducer,
} from 'src/features/common/redux/test6';

describe('common/redux/test6', () => {
  it('returns correct action by test6', () => {
    const expectedAction = {
      type: COMMON_TEST_6,
    };
    expect(test6()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_6 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_6 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
