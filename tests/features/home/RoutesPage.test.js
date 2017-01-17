import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RoutesPage } from 'src/features/home';

describe('home/RoutesPage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <RoutesPage />
    );

    expect(
      renderedComponent.find('.home-routes-page').node
    ).to.exist;
  });
});
