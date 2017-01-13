import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementPage } from 'src/features/home';

describe('home/ElementPage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ElementPage />
    );

    expect(
      renderedComponent.find('.home-element-page').node
    ).to.exist;
  });
});
