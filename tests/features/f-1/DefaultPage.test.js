import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/f-1/DefaultPage';

describe('f-1/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      f1: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.f-1-default-page').node
    ).to.exist;
  });
});
