import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RunTestPage } from 'src/features/rekit-tools';

describe('rekit-tools/RunTestPage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <RunTestPage />
    );

    expect(
      renderedComponent.find('.rekit-tools-run-test-page').node
    ).to.exist;
  });
});
