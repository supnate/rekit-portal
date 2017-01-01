import { expect } from 'chai';

import {
  REKIT_CMDS_SHOW_LOG_VIEWER_DIALOG,
} from 'src/features/rekit-cmds/redux/constants';

import {
  showLogViewerDialog,
  reducer,
} from 'src/features/rekit-cmds/redux/showLogViewerDialog';

describe('rekit-cmds/redux/showLogViewerDialog', () => {
  it('returns correct action by showLogViewerDialog', () => {
    const expectedAction = {
      type: REKIT_CMDS_SHOW_LOG_VIEWER_DIALOG,
    };
    expect(showLogViewerDialog()).to.deep.equal(expectedAction);
  });

  it('handles action type REKIT_CMDS_SHOW_LOG_VIEWER_DIALOG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: REKIT_CMDS_SHOW_LOG_VIEWER_DIALOG }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
