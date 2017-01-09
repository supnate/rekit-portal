import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DetailedDiagram } from 'src/features/diagram';

describe('diagram/DetailedDiagram', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DetailedDiagram />
    );

    expect(
      renderedComponent.find('.diagram-detailed-diagram').node
    ).to.exist;
  });
});
