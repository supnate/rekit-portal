import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DialogPlace } from 'src/features/rekit-cmds';

describe('rekit-cmds/DialogPlace', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DialogPlace />
    );

    expect(
      renderedComponent.find('.rekit-cmds-dialog-place').node
    ).to.exist;
  });
});
