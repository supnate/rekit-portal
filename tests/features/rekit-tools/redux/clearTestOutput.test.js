import { expect } from 'chai';

import {
  REKIT_TOOLS_CLEAR_TEST_OUTPUT,
} from 'src/features/rekit-tools/redux/constants';

import {
  clearTestOutput,
  reducer,
} from 'src/features/rekit-tools/redux/clearTestOutput';

describe('rekit-tools/redux/clearTestOutput', () => {
  it('returns correct action by clearTestOutput', () => {
    const expectedAction = {
      type: REKIT_TOOLS_CLEAR_TEST_OUTPUT,
    };
    expect(clearTestOutput()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_TOOLS_CLEAR_TEST_OUTPUT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: REKIT_TOOLS_CLEAR_TEST_OUTPUT }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
