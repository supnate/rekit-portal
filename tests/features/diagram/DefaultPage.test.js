import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/diagram/DefaultPage';

describe('diagram/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      diagram: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.diagram-default-page').node
    ).to.exist;
  });
});
