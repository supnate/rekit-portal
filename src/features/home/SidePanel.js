import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Dropdown, Icon, Input, Menu } from 'antd';
import * as actions from './redux/actions';
import { showCmdDialog } from '../rekit-cmds/redux/actions';
import { ProjectExplorer } from './';


export class SidePanel extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  @autobind
  handleAddMenuClick(evt) {
    console.log('menu click', evt);

    switch (evt.key) {
      case 'add-feature':
      case 'add-component':
      case 'add-action':
        this.props.actions.showCmdDialog('cmd', {
          type: evt.key,
          ...this.cmdContext,
        });
        break;
      case 'build':
        browserHistory.push('/tools/build');
        break;
      default:
        break;
    }
  }

  @autobind
  renderAddMenu() {
    return (
      <Menu onClick={this.handleAddMenuClick}>
        <Menu.Item key="add-feature"><Icon type="book" style={{ color: '#29b6f6' }} /> &nbsp;Add feature</Menu.Item>
        <Menu.Item key="add-action"><Icon type="notification" style={{ color: '#ec407a' }} /> &nbsp;Add action</Menu.Item>
        <Menu.Item key="add-component"><Icon type="appstore-o" style={{ color: '#F08036' }} /> &nbsp;Add component</Menu.Item>
        <Menu.Item key="run-tests"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Run tests</Menu.Item>
        <Menu.Item key="test-coverage"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Test coverage</Menu.Item>
        <Menu.Item key="build"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Build</Menu.Item>
      </Menu>
    );
  }

  render() {
    let prjName = this.props.home.projectRoot.split('/').pop();
    prjName = _.upperFirst(_.lowerCase(prjName));
    return (
      <div className="home-side-panel">
        <div className="header">
          <a href="https://github.com/supnate/rekit" target="_blank" rel="noopener noreferrer" title="Powered by Rekit.">
            <img src={require('../../images/logo_small.png')} alt="Rekit logo" />
          </a>
          <h5 title={this.props.home.projectRoot}>{prjName}</h5>
          <Dropdown overlay={this.renderAddMenu()}>
            <label style={{ display: 'inline-block', transform: 'translateY(4px)', cursor: 'pointer' }}>
              <Icon type="ellipsis" style={{ fontSize: '20px', fontWeight: 'bold' }} />
            </label>
          </Dropdown>
        </div>
        <div className="toolbar">
          <Input.Search />
        </div>
        <ProjectExplorer />
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
    actions: bindActionCreators({ ...actions, showCmdDialog }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);
