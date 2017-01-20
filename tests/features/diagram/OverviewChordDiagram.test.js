import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OverviewChordDiagram } from 'src/features/diagram';

describe('diagram/OverviewChordDiagram', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <OverviewChordDiagram />
    );

    expect(
      renderedComponent.find('.diagram-overview-chord-diagram').node
    ).to.exist;
  });
});
