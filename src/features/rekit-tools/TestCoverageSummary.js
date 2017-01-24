import React, { PureComponent, PropTypes } from 'react';
import { Button, Alert } from 'antd';

export default class TestCoverageSummary extends PureComponent {
  static propTypes = {

  };

  render() {
    return (
      <div className="rekit-tools-test-coverage-summary">
        <Alert message="No coverage data found. Need to run tests first." type="info" showIcon />
        <Button type="primary">Run tests</Button>
      </div>
    );
  }
}
