import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ProjectExplorer } from 'src/features/home';

describe('home/ProjectExplorer', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ProjectExplorer />
    );

    expect(
      renderedComponent.find('.home-project-explorer').node
    ).to.exist;
  });
});
