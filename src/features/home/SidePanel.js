import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Button, Col, Dropdown, Icon, Input, Menu, Row } from 'antd';
import * as actions from './redux/actions';
import { ProjectExplorer } from './';


export class SidePanel extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  @autobind
  handleAddMenuClick() {
  }

  @autobind
  renderAddMenu() {
    return (
      <Menu onClick={this.handleAddMenuClick}>
        <Menu.Item key="1"><Icon type="book" style={{ color: '#29b6f6' }} /> &nbsp;Add feature</Menu.Item>
        <Menu.Item key="2"><Icon type="notification" style={{ color: '#ec407a' }} /> &nbsp;Add action</Menu.Item>
        <Menu.Item key="3"><Icon type="appstore-o" style={{ color: '#F08036' }} /> &nbsp;Add component</Menu.Item>
        <Menu.Item key="4"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Run tests</Menu.Item>
        <Menu.Item key="5"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Test coverage</Menu.Item>
        <Menu.Item key="6"><Icon type="appstore-o" style={{ color: 'transparent' }} /> &nbsp;Build</Menu.Item>
      </Menu>
    );
  }

  render() {
    return (
      <div className="home-side-panel">
        <div className="toolbar">
          <Row>
            <Col span={18}>
              <Input.Search />
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Dropdown overlay={this.renderAddMenu()}>
                <label style={{ display: 'inline-block', transform: 'translateY(4px)', cursor: 'pointer' }}>
                  <Icon type="ellipsis" style={{ fontSize: '20px', fontWeight: 'bold' }} />
                  
                </label>
              </Dropdown>
            </Col>
          </Row>
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
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);
