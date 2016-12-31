import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CmdDialog } from 'src/features/rekit-cmds';

describe('rekit-cmds/CmdDialog', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <CmdDialog />
    );

    expect(
      renderedComponent.find('.rekit-cmds-cmd-dialog').node
    ).to.exist;
  });
});
