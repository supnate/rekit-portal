import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CodeView } from 'src/features/home';

describe('home/CodeView', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <CodeView />
    );

    expect(
      renderedComponent.find('.home-code-view').node
    ).to.exist;
  });
});
