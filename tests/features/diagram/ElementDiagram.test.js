import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementDiagram } from 'src/features/diagram';

describe('diagram/ElementDiagram', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ElementDiagram />
    );

    expect(
      renderedComponent.find('.diagram-element-diagram').node
    ).to.exist;
  });
});
