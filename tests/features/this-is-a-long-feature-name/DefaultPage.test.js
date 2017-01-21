import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/this-is-a-long-feature-name';

describe('this-is-a-long-feature-name/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DefaultPage />
    );

    expect(
      renderedComponent.find('.this-is-a-long-feature-name-default-page').node
    ).to.exist;
  });
});
