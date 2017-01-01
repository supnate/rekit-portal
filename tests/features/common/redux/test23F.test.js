import { expect } from 'chai';

import {
  COMMON_TEST_23_F,
} from 'src/features/common/redux/constants';

import {
  test23F,
  reducer,
} from 'src/features/common/redux/test23F';

describe('common/redux/test23F', () => {
  it('returns correct action by test23F', () => {
    const expectedAction = {
      type: COMMON_TEST_23_F,
    };
    expect(test23F()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_23_F correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_23_F }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
