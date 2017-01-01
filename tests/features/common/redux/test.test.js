import { expect } from 'chai';

import {
  COMMON_TEST,
} from 'src/features/common/redux/constants';

import {
  test,
  reducer,
} from 'src/features/common/redux/test';

describe('common/redux/test', () => {
  it('returns correct action by test', () => {
    const expectedAction = {
      type: COMMON_TEST,
    };
    expect(test()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TEST correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TEST }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
