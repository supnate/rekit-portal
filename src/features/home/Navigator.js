import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import * as actions from './redux/actions';
import { Dropdown, Icon, Menu, Tree, Spin } from 'antd';

const TreeNode = Tree.TreeNode;

const keys = ['0-0-0', '0-0-1', '0-0'];

const connectMark = { char: 'C', color: '#2175bc', title: 'Connect' };
const routeMark = { char: 'R', color: '#f90', title: 'Route' };
const asyncMark = { char: 'A', color: '#259b24', title: 'Async' };

export class Navigator extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    keys: ['0-0-0', '0-0-1'],
  };

  state = {
    defaultExpandedKeys: keys,
  };

  componentDidMount() {
    this.props.actions.fetchNavTreeData();
  }

  onSelect(info) {
    console.log('selected', info);
  }

  @autobind
  handleContextMenu(evt) {
    console.log('menu right click: ', evt);

    this.contextMenuArchor.style.display = 'inline-block';
    const x = evt.event.clientX - this.rootNode.offsetLeft + this.rootNode.scrollLeft; // eslint-disable-line
    const y = evt.event.clientY - this.rootNode.offsetTop + this.rootNode.scrollTop; // eslint-disable-line
    this.contextMenuArchor.style.left = `${x}px`;
    this.contextMenuArchor.style.top = `${y}px`;
    // This seems to be the most compatible method for now, use standard new Event() when possible such as:
    // var ev = new Event("look", {"bubbles":true, "cancelable":false});
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
    const clickEvent = document.createEvent('HTMLEvents');
    clickEvent.initEvent('click', true, true);
    this.contextMenuArchor.dispatchEvent(clickEvent);
  }

  @autobind
  handleContextMenuVisibleChange(visible) {
    if (!visible) {
      this.contextMenuArchor.style.display = 'none';
    }
  }

  handleMenuClick(evt) {
    console.log('right click: ', evt);
  }

  renderTreeNodeTitle(label, icon, ...marks) {
    return (
      <span>
        {icon && <Icon type={icon} />}
        <label title={label}>{label}</label>
        {
          marks.filter(m => !!m).map(mark => <span key={mark.char} className="mark" style={{ backgroundColor: mark.color }}>{mark.char}</span>)
        }
      </span>
    );
  }

  renderMiscFolder(folder) {
    return (
      <TreeNode className="misc" title={this.renderTreeNodeTitle(folder.name, 'folder')} key={folder.file}>
        {
          folder.children.map(miscItem => (
            miscItem.children ?
              this.renderMiscFolder(miscItem)
            :
              <TreeNode title={this.renderTreeNodeTitle(miscItem.name)} key={miscItem.file} />
          ))
        }
      </TreeNode>
    );
  }

  renderFeatureNode(key) {
    const feature = this.props.home.featureById[key];
    console.log('key: ', key);
    return (
      <TreeNode title={this.renderTreeNodeTitle(feature.name)} key={key}>
        <TreeNode className="routes" title={this.renderTreeNodeTitle('Routes', 'share-alt')} key={`${key}-routes`} />
        <TreeNode className="actions" title={this.renderTreeNodeTitle(`Actions (${feature.actions.length})`, 'notification')} key={`${key}-actions`}>
          {
            feature.actions.map(action => (
              <TreeNode title={this.renderTreeNodeTitle(action.name, '', action.isAsync && asyncMark)} key={action.file} />
            ))
          }
        </TreeNode>
        <TreeNode className="components" title={this.renderTreeNodeTitle(`Components (${feature.components.length})`, 'appstore-o')} key={`${key}-components`}>
          {
            feature.components.map(comp => (
              <TreeNode title={this.renderTreeNodeTitle(comp.name, '', comp.connectToStore && connectMark)} key={comp.file} />
            ))
          }
        </TreeNode>
        {
          this.renderMiscFolder({ children: feature.misc, name: 'Misc', file: `${key}-misc` })
        }
      </TreeNode>
    );
  }

  renderLoading() {
    return (
      <div className="home-navigator">
        <Spin />
      </div>
    );
  }

  renderContextMenu() {
    return (
      <Menu
        onSelect={this.handleMenuClick}
        selectedKeys={[]}
      >
        <Menu.Item key="1">Add component</Menu.Item>
      </Menu>
    );
  }

  render() {
    const { features } = this.props.home;

    if (!features) {
      return this.renderLoading();
    }

    return (
      <div className="home-navigator" ref={(node) => { this.rootNode = node; }}>
        <Tree
          onRightClick={this.handleContextMenu}
          onSelect={this.onSelect}
          defaultExpandedKeys={['product', 'opportunity', 'customer', 'lead', 'product-components']}
        >
          {
            features.map(f => this.renderFeatureNode(f))
          }
        </Tree>
        <Dropdown overlay={this.renderContextMenu()} trigger={['click']} onVisibleChange={this.handleContextMenuVisibleChange}>
          <span ref={(node) => { this.contextMenuArchor = node; }} className="context-menu-archor">&nbsp;</span>
        </Dropdown>
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
)(Navigator);
