import { expect } from 'chai';

import {
  COMMON_TEST_123,
} from 'src/features/common/redux/constants';

import {
  test123,
  reducer,
} from 'src/features/common/redux/test123';

describe('common/redux/test123', () => {
  it('returns correct action by test123', () => {
    const expectedAction = {
      type: COMMON_TEST_123,
    };
    expect(test123()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_123 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_123 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
