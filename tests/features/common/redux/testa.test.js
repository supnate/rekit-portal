import { expect } from 'chai';

import {
  COMMON_TESTA,
} from 'src/features/common/redux/constants';

import {
  testa,
  reducer,
} from 'src/features/common/redux/testa';

describe('common/redux/testa', () => {
  it('returns correct action by testa', () => {
    const expectedAction = {
      type: COMMON_TESTA,
    };
    expect(testa()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTA correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTA }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
