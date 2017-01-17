import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Icon, Tabs } from 'antd';
import { CodeView } from './';
import * as actions from './redux/actions';

const TabPane = Tabs.TabPane;
export class RoutesPage extends Component {
  static propTypes = {
    rekitCmds: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    home: PropTypes.object.isRequired,
  };

  @autobind
  handleTabChange(tabKey) {
    const fid = this.props.params.feature;
    switch (tabKey) {
      case 'rules':
        browserHistory.push(`/${fid}/routes`);
        break;
      case 'code':
        browserHistory.push(`/${fid}/routes/code`);
        break;
      default:
        break;
    }
  }

  render() {
    const fid = this.props.params.feature;
    let tabKey = this.props.params.type;
    if (tabKey !== 'code') tabKey = 'rules';
    const feature = this.props.home.featureById[fid];
    const codeFile = `${this.props.home.projectRoot}/src/features/${fid}/route.js`;
    return (
      <div className="home-routes-page">
        <h2><Icon type="share-alt" /> &nbsp;{fid} / routes</h2>
        <Tabs activeKey={tabKey} animated={false} onChange={this.handleTabChange}>
          <TabPane tab="Rules" key="rules">
            <p>This is a rough overview of routing config defined in a feature. </p>
            <p>For detailed information, please look at <span className="highlight-label">src/features/{fid}/route.js</span>.</p>
            {feature.routes.length === 0
              ? <Alert type="info" message="No routing rules defined." showIcon />
              :
              <table>
                <thead>
                  <tr>
                    <th>Path</th>
                    <th>Component</th>
                  </tr>
                </thead>
                <tbody>
                  {feature.routes.map(route => (
                    <tr key={route.path}>
                      <td>{route.path}</td>
                      <td>{fid}/{route.component}</td>
                    </tr>
                  ))}
                </tbody>
              </table>}
          </TabPane>
          <TabPane tab="Code" key="code">
            <CodeView file={codeFile} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    rekitCmds: state.rekitCmds,
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutesPage);
