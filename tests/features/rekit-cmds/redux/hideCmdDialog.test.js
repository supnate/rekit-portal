import { expect } from 'chai';

import {
  REKIT_CMDS_HIDE_CMD_DIALOG,
} from 'src/features/rekit-cmds/redux/constants';

import {
  hideCmdDialog,
  reducer,
} from 'src/features/rekit-cmds/redux/hideCmdDialog';

describe('rekit-cmds/redux/hideCmdDialog', () => {
  it('returns correct action by hideCmdDialog', () => {
    const expectedAction = {
      type: REKIT_CMDS_HIDE_CMD_DIALOG,
    };
    expect(hideCmdDialog()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_CMDS_HIDE_CMD_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_HIDE_CMD_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
