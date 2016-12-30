import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Navigator } from 'src/features/home';

describe('home/Navigator', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Navigator />
    );

    expect(
      renderedComponent.find('.home-navigator').node
    ).to.exist;
  });
});
