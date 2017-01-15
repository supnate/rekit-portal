import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { BuildPageJs } from 'src/features/rekit-tools';

describe('rekit-tools/BuildPageJs', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <BuildPageJs />
    );

    expect(
      renderedComponent.find('.rekit-tools-build-page-js').node
    ).to.exist;
  });
});
