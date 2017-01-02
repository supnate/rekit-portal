import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CmdForm } from 'src/features/rekit-cmds';

describe('rekit-cmds/CmdForm', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <CmdForm />
    );

    expect(
      renderedComponent.find('.rekit-cmds-cmd-form').node
    ).to.exist;
  });
});
