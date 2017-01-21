import { expect } from 'chai';

import {
  F_1_SAMPLE_ACTION,
} from 'src/features/this-is-a-long-feature-name/redux/constants';

import {
  sampleAction,
  reducer,
} from 'src/features/this-is-a-long-feature-name/redux/sampleAction';

describe('this-is-a-long-feature-name/redux/sampleAction', () => {
  it('returns correct action by sampleAction', () => {
    const expectedAction = {
      type: F_1_SAMPLE_ACTION,
    };
    expect(sampleAction()).to.deep.equal(expectedAction);
  });

  it('handles action type F_1_SAMPLE_ACTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: F_1_SAMPLE_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
