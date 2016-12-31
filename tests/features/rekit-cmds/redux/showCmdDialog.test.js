import { expect } from 'chai';

import {
  REKIT_CMDS_SHOW_CMD_DIALOG,
} from 'src/features/rekit-cmds/redux/constants';

import {
  showCmdDialog,
  reducer,
} from 'src/features/rekit-cmds/redux/showCmdDialog';

describe('rekit-cmds/redux/showCmdDialog', () => {
  it('returns correct action by showCmdDialog', () => {
    const expectedAction = {
      type: REKIT_CMDS_SHOW_CMD_DIALOG,
    };
    expect(showCmdDialog()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_CMDS_SHOW_CMD_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_SHOW_CMD_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
