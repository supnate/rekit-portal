import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import axios from 'axios';
import * as d3 from 'd3';
import { Alert, Button, Icon, Tooltip } from 'antd';

export default class TestCoverageSummary extends PureComponent {
  static propTypes = {

  };

  state = {
    reportData: null,
    loading: false,
    noData: false,
    error: null,
  };

  async componentWillMount() {
    try {
      const res = await axios.get('/coverage/lcov-report/index.html');
      this.setState({
        noData: false,
        reportData: res.data,
      });
    } catch (e) {
      const status = _.get(e, 'response.status');
      if (status === 404) {
        this.setState({ noData: true });
      } else {
        this.setState({ error: e });
      }
      console.log(status);
    }
    this.setState({ loading: false });
  }

  renderLoading() {
    return (
      <div className="rekit-tools-test-coverage-summary" style={{ color: '#aaa' }}>
        <Icon type="loading-3-quarters" spin /> Loading...
      </div>
    );
  }

  renderReport() {
    const color = d3.scaleLinear()
      .domain([0, 90])
      .range(['#ef5350', '#81C784'])
    ;
    let arr = [];
    for (let i = 5; i < 100; i+=20)arr.push(i);
    arr = _.shuffle(arr);
    return (
      <ul>
        <li>
          <h4>Overall coverage: 80%</h4>
          <div className="coverage-percent">
            <div className="percent-inner" style={{ width: '80%' }} />
          </div>
        </li>

        <li><h4>Features coverage:</h4></li>
        {arr.map(p => (
          <li key={p} className="feature-coverage">
            <label>Percentage: {p}%</label>
            <div className="coverage-percent">
              <div
                className="percent-inner"
                style={{ width: `${p}%`, backgroundColor: color(p) }}
              />
            </div>
          </li>
        ))}
        <li className="feature-coverage">
          <label>
            Percentage:
            <Tooltip title="If tests failed, the report will not have full data.">
              <span style={{ color: 'red' }}> No data.</span>
            </Tooltip>
          </label>
          <div className="coverage-percent">
            <div
              className="percent-inner"
              style={{ width: `${0}%`, backgroundColor: color(0) }}
            />
          </div>
        </li>

        <li><Link to="/tools/coverage">See more...</Link></li>
      </ul>
    );
  }

  render() {
    if (this.state.loading) return this.renderLoading();
    return (
      <div className="rekit-tools-test-coverage-summary">

        {this.state.error && <Alert message={`Failed to request test coverage data: ${this.state.error}`} type="error" showIcon />}
        {this.state.noData &&
          <div>
            <Alert message="No coverage data found. Need to run tests first." type="info" showIcon />
            <Button type="primary">Run tests now</Button>
          </div>}
        {this.state.reportData && this.renderReport()}

      </div>
    );
  }
}
