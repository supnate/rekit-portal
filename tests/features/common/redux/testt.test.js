import { expect } from 'chai';

import {
  COMMON_TESTT,
} from 'src/features/common/redux/constants';

import {
  testt,
  reducer,
} from 'src/features/common/redux/testt';

describe('common/redux/testt', () => {
  it('returns correct action by testt', () => {
    const expectedAction = {
      type: COMMON_TESTT,
    };
    expect(testt()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTT }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
