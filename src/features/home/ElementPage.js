import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Tabs } from 'antd';
import * as actions from './redux/actions';
import { ElementDiagram } from '../diagram';
import { CodeView } from './';

const TabPane = Tabs.TabPane;

export class ElementPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  static defaultProps = {
    params: {},
  };

  getComponentData() {
    const { featureById } = this.props.home;
    const { feature, component } = this.props.params;
    return _.find(featureById[feature].components, { name: component });
  }

  @autobind
  handleTabChange(tabKey) {
    const data = this.getComponentData();
    browserHistory.push(`/component/${data.feature}/${data.name}/${tabKey}`);
  }

  renderNotFound() {
    return (
      <div className="home-component-view">
        Not found.
      </div>
    );
  }

  render() {
    const data = this.getComponentData();
    if (!data) {
      return this.renderNotFound();
    }

    const { home } = this.props;

    let codeFile;
    const tabKey = this.props.params.tabKey || 'diagram';

    switch (tabKey) {
      case 'code':
        codeFile = data.file;
        break;
      case 'style':
        codeFile = `${home.projectRoot}/src/features/${data.feature}/${data.name}.${home.cssExt}`;
        break;
      case 'test':
        codeFile = `${home.projectRoot}/tests/features/${data.feature}/${data.name}.test.js`;
        break;
      default:
        codeFile = data.file;
        break;
    }

    return (
      <div className="home-component-view">
        <div className="page-title">
          <h2 style={{ fontWeight: 'normal' }}>
            <Icon type="appstore-o" style={{ color: '#F08036' }} /> {this.props.params.feature} / {data.name}
          </h2>
        </div>
        <br />
        <Tabs activeKey={tabKey} animated={false} onChange={this.handleTabChange}>
          <TabPane tab="Diagram" key="diagram" />
          <TabPane tab="Code" key="code" />
          <TabPane tab="Style" key="style" />
          <TabPane tab="Test" key="test" />
        </Tabs>
        {tabKey === 'diagram' && <ElementDiagram homeStore={this.props.home} elementId={data.file} />}
        {tabKey !== 'diagram' && <CodeView file={codeFile} />}

      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
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
)(ElementPage);
