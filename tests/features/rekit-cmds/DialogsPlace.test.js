import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DialogsPlace } from 'src/features/rekit-cmds';

describe('rekit-cmds/DialogsPlace', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DialogsPlace />
    );

    expect(
      renderedComponent.find('.rekit-cmds-dialogs-place').node
    ).to.exist;
  });
});
