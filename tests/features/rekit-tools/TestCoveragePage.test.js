import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestCoveragePage } from 'src/features/rekit-tools';

describe('rekit-tools/TestCoveragePage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <TestCoveragePage />
    );

    expect(
      renderedComponent.find('.rekit-tools-test-coverage-page').node
    ).to.exist;
  });
});
