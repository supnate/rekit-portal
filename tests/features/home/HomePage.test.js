import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { HomePage } from 'src/features/home';

describe('home/HomePage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <HomePage />
    );

    expect(
      renderedComponent.find('.home-home-page').node
    ).to.exist;
  });
});
