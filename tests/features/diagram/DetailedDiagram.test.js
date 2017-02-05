import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DetailedDiagram } from 'src/features/diagram/DetailedDiagram';

describe('diagram/DetailedDiagram', () => {
  it('renders node with correct class name', () => {
    const props = {
      diagram: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DetailedDiagram {...props} />
    );

    expect(
      renderedComponent.find('.diagram-detailed-diagram').node
    ).to.exist;
  });
});
