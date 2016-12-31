import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AddActionForm } from 'src/features/rekit-cmds';

describe('rekit-cmds/AddActionForm', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <AddActionForm />
    );

    expect(
      renderedComponent.find('.rekit-cmds-add-action-form').node
    ).to.exist;
  });
});
