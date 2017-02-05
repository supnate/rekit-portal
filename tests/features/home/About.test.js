import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { About } from 'src/features/home';

describe('home/About', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <About />
    );

    expect(
      renderedComponent.find('.home-about').node
    ).to.exist;
  });
});
