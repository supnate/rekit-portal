import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Test999 } from 'src/features/common/Test999';

describe('common/Test999', () => {
  it('renders node with correct class name', () => {
    const props = {
      rekitCmds: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Test999 {...props} />
    );

    expect(
      renderedComponent.find('.common-test-999').node
    ).to.exist;
  });
});
