import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SidePanel } from 'src/features/home';

describe('home/SidePanel', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <SidePanel />
    );

    expect(
      renderedComponent.find('.home-side-panel').node
    ).to.exist;
  });
});
