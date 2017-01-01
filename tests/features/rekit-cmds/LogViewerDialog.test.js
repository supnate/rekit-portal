import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { LogViewerDialog } from 'src/features/rekit-cmds';

describe('rekit-cmds/LogViewerDialog', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <LogViewerDialog />
    );

    expect(
      renderedComponent.find('.rekit-cmds-log-viewer-dialog').node
    ).to.exist;
  });
});
