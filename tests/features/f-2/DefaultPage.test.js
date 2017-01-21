import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/f-2';

describe('f-2/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DefaultPage />
    );

    expect(
      renderedComponent.find('.f-2-default-page').node
    ).to.exist;
  });
});
