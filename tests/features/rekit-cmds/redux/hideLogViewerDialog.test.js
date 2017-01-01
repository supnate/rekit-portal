import { expect } from 'chai';

import {
  REKIT_CMDS_HIDE_LOG_VIEWER_DIALOG,
} from 'src/features/rekit-cmds/redux/constants';

import {
  hideLogViewerDialog,
  reducer,
} from 'src/features/rekit-cmds/redux/hideLogViewerDialog';

describe('rekit-cmds/redux/hideLogViewerDialog', () => {
  it('returns correct action by hideLogViewerDialog', () => {
    const expectedAction = {
      type: REKIT_CMDS_HIDE_LOG_VIEWER_DIALOG,
    };
    expect(hideLogViewerDialog()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_CMDS_HIDE_LOG_VIEWER_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_HIDE_LOG_VIEWER_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
