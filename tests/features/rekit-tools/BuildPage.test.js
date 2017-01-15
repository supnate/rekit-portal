import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { BuildPage } from 'src/features/rekit-tools';

describe('rekit-tools/BuildPage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <BuildPage />
    );

    expect(
      renderedComponent.find('.rekit-tools-build-page').node
    ).to.exist;
  });
});
