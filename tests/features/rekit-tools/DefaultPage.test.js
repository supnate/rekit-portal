import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/rekit-tools/DefaultPage';

describe('rekit-tools/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      rekitTools: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.rekit-tools-default-page').node
    ).to.exist;
  });
});
