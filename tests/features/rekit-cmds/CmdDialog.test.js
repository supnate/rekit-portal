import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CmdDialog } from 'src/features/rekit-cmds';

describe('rekit-cmds/CmdDialog', () => {
  it('renders dialog without error', () => {
    const renderedComponent = shallow(
      <CmdDialog />
    );

    // antd Modal renders the dialog into document.body, do don't test the dialog
    expect(
      renderedComponent
    ).to.exist;
  });
});
