import { expect } from 'chai';

import {
  COMMON_TEST_2_FE,
} from 'src/features/common/redux/constants';

import {
  test2Fe,
  reducer,
} from 'src/features/common/redux/test2Fe';

describe('common/redux/test2Fe', () => {
  it('returns correct action by test2Fe', () => {
    const expectedAction = {
      type: COMMON_TEST_2_FE,
    };
    expect(test2Fe()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST_2_FE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST_2_FE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
