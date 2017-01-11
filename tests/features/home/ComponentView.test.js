import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ComponentView } from 'src/features/home';

describe('home/ComponentView', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ComponentView />
    );

    expect(
      renderedComponent.find('.home-component-view').node
    ).to.exist;
  });
});
