import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Test1 } from 'src/features/diagram';

describe('diagram/Test1', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Test1 />
    );

    expect(
      renderedComponent.find('.diagram-test-1').node
    ).to.exist;
  });
});
