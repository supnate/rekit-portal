import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestCoverageSummary } from 'src/features/rekit-tools';

describe('rekit-tools/TestCoverageSummary', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <TestCoverageSummary />
    );

    expect(
      renderedComponent.find('.rekit-tools-test-coverage-summary').node
    ).to.exist;
  });
});
