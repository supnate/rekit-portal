import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/diagram/DefaultPage';

describe('diagram/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        features: ['f1'],
        featureById: {
          f1: {
            name: 'F1',
            deps: [],
          }
        },
      },
      actions: {},
      diagram: {},
      diagramData: { nodes: [], links: [] },
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.diagram-default-page').node
    ).to.exist;
  });
});
