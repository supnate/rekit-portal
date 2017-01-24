import React, { PureComponent, PropTypes } from 'react';

export default class TestCoverageSummary extends PureComponent {
  static propTypes = {

  };

  render() {
    return (
      <div className="rekit-tools-test-coverage-summary">
        <div>No coverage data found. Need to run tests first.</div>
      </div>
    );
  }
}
