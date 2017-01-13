import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { App } from 'src/features/home';

describe('home/App', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <App />
    );

    expect(
      renderedComponent.find('.home-app').node
    ).to.exist;
  });
});
