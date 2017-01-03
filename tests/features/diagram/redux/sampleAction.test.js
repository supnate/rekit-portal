import { expect } from 'chai';

import {
  DIAGRAM_SAMPLE_ACTION,
} from 'src/features/diagram/redux/constants';

import {
  sampleAction,
  reducer,
} from 'src/features/diagram/redux/sampleAction';

describe('diagram/redux/sampleAction', () => {
  it('returns correct action by sampleAction', () => {
    const expectedAction = {
      type: DIAGRAM_SAMPLE_ACTION,
    };
    expect(sampleAction()).to.deep.equal(expectedAction);
  });

  it('handles action type DIAGRAM_SAMPLE_ACTION correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: DIAGRAM_SAMPLE_ACTION }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
