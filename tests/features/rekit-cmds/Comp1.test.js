import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Comp1 } from 'src/features/rekit-cmds';

describe('rekit-cmds/Comp1', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Comp1 />
    );

    expect(
      renderedComponent.find('.rekit-cmds-comp-1').node
    ).to.exist;
  });
});
