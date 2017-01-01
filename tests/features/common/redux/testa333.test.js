import { expect } from 'chai';

import {
  COMMON_TESTA_333,
} from 'src/features/common/redux/constants';

import {
  testa333,
  reducer,
} from 'src/features/common/redux/testa333';

describe('common/redux/testa333', () => {
  it('returns correct action by testa333', () => {
    const expectedAction = {
      type: COMMON_TESTA_333,
    };
    expect(testa333()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTA_333 correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTA_333 }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
