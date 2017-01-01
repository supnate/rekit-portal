import { expect } from 'chai';

import {
  COMMON_TEST_11,
} from 'src/features/common/redux/constants';

import {
  test11,
  reducer,
} from 'src/features/common/redux/test11';

describe('common/redux/test11', () => {
  it('returns correct action by test11', () => {
    const expectedAction = {
      type: COMMON_TEST_11,
    };
    expect(test11()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_11 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_11 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
