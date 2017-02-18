import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/f-345/DefaultPage';

describe('f-345/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      f1: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.f-345-default-page').node
    ).to.exist;
  });
});
