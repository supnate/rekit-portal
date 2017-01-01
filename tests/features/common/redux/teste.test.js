import { expect } from 'chai';

import {
  COMMON_TESTE,
} from 'src/features/common/redux/constants';

import {
  teste,
  reducer,
} from 'src/features/common/redux/teste';

describe('common/redux/teste', () => {
  it('returns correct action by teste', () => {
    const expectedAction = {
      type: COMMON_TESTE,
    };
    expect(teste()).to.deep.equal(expectedAction);
  });

  it('handles action type COMMON_TESTE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: COMMON_TESTE }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
