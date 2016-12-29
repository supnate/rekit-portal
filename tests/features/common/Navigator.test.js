import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Navigator } from 'src/features/common';

describe('common/Navigator', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Navigator />
    );

    expect(
      renderedComponent.find('.common-navigator').node
    ).to.exist;
  });
});
