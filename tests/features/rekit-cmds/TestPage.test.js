import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestPage } from 'src/features/rekit-cmds/TestPage';

describe('rekit-cmds/TestPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      rekitCmds: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TestPage {...props} />
    );

    expect(
      renderedComponent.find('.rekit-cmds-test-page').node
    ).to.exist;
  });
});
