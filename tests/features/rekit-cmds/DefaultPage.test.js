import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/rekit-cmds/DefaultPage';

describe('rekit-cmds/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      rekitCmds: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.rekit-cmds-default-page').node
    ).to.exist;
  });
});
