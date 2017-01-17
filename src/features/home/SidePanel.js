import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
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
      case 'tests':
        browserHistory.push('/tools/tests');
        break;
      case 'test-coverage':
        browserHistory.push('/tools/coverage');
        break;
      default:
        break;
    }
  }

  @autobind
  handleSearch(evt) {
    console.log('searching: ', evt);
  }

  @autobind
  renderAddMenu() {
    return (
      <Menu onClick={this.handleAddMenuClick}>
        <Menu.Item key="add-feature"><Icon type="book" style={{ color: '#29b6f6' }} /> &nbsp;Add feature</Menu.Item>
        <Menu.Item key="add-action"><Icon type="notification" style={{ color: '#ec407a' }} /> &nbsp;Add action</Menu.Item>
        <Menu.Item key="add-component"><Icon type="appstore-o" style={{ color: '#F08036' }} /> &nbsp;Add component</Menu.Item>
        <Menu.Item key="tests"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Run tests</Menu.Item>
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
          <Link className="home-link" to="/" title={this.props.home.projectRoot}>
            <Icon type="home" />
            <h5>{prjName}</h5>
          </Link>
          <Dropdown overlay={this.renderAddMenu()}>
            <label>
              <Icon type="ellipsis" style={{ fontSize: '20px', fontWeight: 'bold' }} />
            </label>
          </Dropdown>
        </div>
        <div className="toolbar">
          <Input.Search onSearch={this.handleSearch} />
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

//<a href="https://github.com/supnate/rekit" target="_blank" rel="noopener noreferrer" title="Powered by Rekit.">
//          <img src={require('../../images/logo_small.png')} alt="Rekit logo" />
//        </a>

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
