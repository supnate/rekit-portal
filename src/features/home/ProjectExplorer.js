import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Dropdown, Icon, Menu, message, Modal, Tree, Spin } from 'antd';
import cmdSuccessNotification from '../rekit-cmds/cmdSuccessNotification';
import * as actions from './redux/actions';
import { execCmd, showCmdDialog, dismissExecCmdError } from '../rekit-cmds/redux/actions';
import { getExplorerTreeData } from './selectors/getExplorerTreeData';

const TreeNode = Tree.TreeNode;

const connectMark = { char: 'C', color: '#2175bc', title: 'Connect' };
const routeMark = { char: 'R', color: '#f90', title: 'Route' };
const asyncMark = { char: 'A', color: '#259b24', title: 'Async' };

const menuItems = {
  addAction: { name: 'Add action', key: 'add-action' },
  addComponent: { name: 'Add component', key: 'add-component' },
  addFeature: { name: 'Add feature', key: 'add-feature' },
  del: { name: 'Delete', key: 'del' },
  move: { name: 'Move', key: 'move' },
  rename: { name: 'Rename', key: 'rename' },
  showTest: { name: 'Unit test', key: 'show-test' },
  runTest: { name: 'Run test', key: 'run-test' },
  runTests: { name: 'Run tests', key: 'run-tests' },
  showStyle: { name: 'Style', key: 'show-style' },
};

export class ProjectExplorer extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    searchKey: PropTypes.string,
  };

  static defaultProps = {
    keys: ['0-0-0', '0-0-1'],
    searchKey: '',
  };

  state = {
    expandedKeys: ['common', 'home', 'diagram', 'rekit-cmds', 'rekit-tools'],
    contextMenu: [],
    selectedKey: null,
  };

  getMenuItems(treeNode) {
    const evtKey = treeNode.props.eventKey;
    const { home } = this.props;
    const ele = home.elementById[evtKey] || home.featureById[evtKey] || this.treeNodeData[evtKey];
console.log(ele);
    switch (ele.type) {
      case 'feature':
        return [
          menuItems.addComponent,
          menuItems.addAction,
          menuItems.rename,
          menuItems.runTests,
          menuItems.del,
        ];
      case 'routes':
        break;
      case 'actions':
        return [
          menuItems.addAction,
          menuItems.runTests,
        ];
      case 'action':
        return [
          menuItems.rename,
          menuItems.move,
          menuItems.runTest,
          menuItems.del,
        ];
      case 'components':
        return [
          menuItems.addComponent,
          menuItems.runTests,
        ];
      case 'component':
        return [
          menuItems.rename,
          menuItems.move,
          menuItems.runTest,
          menuItems.del,
        ];
      case 'misc':
        break;
      case 'misc-file':
        break;
      default:
        break;
    }
    return [];
  }

  getExpandedKeys() {
    if (!this.props.searchKey) return this.state.expandedKeys;
    const { elementById } = this.props.home;
    const arr = [];
    this.matchedKeys.forEach((k) => {
      const ele = elementById[k];
      if (ele && ele.feature && ele.type) {
        const treeNodeKey = `${ele.feature}-${ele.type}${ele.type === 'misc' ? '' : 's'}`;
        arr.push(treeNodeKey);
      }
    });
    return _.uniq(arr);
  }

  getTreeData() {
    const { features, featureById, elementById } = this.props.home;
    const nodes = features.map((fid) => {
      const feature = featureById[fid];
      return {
        children: [
          { label: 'Routes', icon: '', count: feature.routes.length },
          { label: 'Actions', icon: 'notification', count: 1 },
          { label: 'Components', icon: '', count: 2 },
          { label: 'Misc', icon: '' },
        ],
      };
    });

    return _.compact(nodes);
  }

  getComponentsTreeData(fid) {
    const { featureById } = this.props.home;
    const feature = featureById[fid];
    const components = feature.components;

    return {
      key: `${fid}-components`,
      className: 'components',
      label: 'Components',
      icon: 'appstore-o',
      count: components.length,
      children: components.map(comp => ({
        key: comp.file,
        className: 'component',
        label: comp.name,
        icon: 'appstore-o',
        marks: [],
      })),
    };
  }
  getActionsTreeData(fid) {
    const { featureById } = this.props.home;
    const feature = featureById[fid];
    const fActions = feature.actions;

    return {
      key: `${fid}-actions`,
      className: 'actions',
      label: 'Actions',
      icon: 'appstore-o',
      count: fActions.length,
      children: fActions.map(action => ({
        key: action.file,
        className: 'action',
        label: action.name,
        icon: 'notification',
        marks: [],
      })),
    };
  }
  getMiscTreeData() {

  }

  getFilteredTreeData() {

  }

  @autobind
  filterMiscFolder(folder, sk) {
    console.log('filtering folder: ', folder.file);
    return {
      ...folder,
      children: _.compact(folder.children.map((child) => {
        if (child.children) {
          const c = this.filterMiscFolder(child, sk);
          return c.children.length > 0 ? c : null;
        }
        return child.name.toLowerCase().indexOf(sk.toLowerCase()) >= 0 ? child : null;
      })),
    };
  }

  createCmdContext(evt) {
    const key = evt.node.props.eventKey;
    const { home } = this.props;
    const ele = home.elementById[key] || home.featureById[key] || this.treeNodeData[key];

    this.cmdContext = {
      feature: ele.feature,
      elementType: ele.type,
      elementName: ele.name,
      file: key,
    };
  }

  createMatchedKeys() {
    // TODO: optimize it using selectors
    const key = this.props.searchKey;
    const arr = [];
    this.matchedKeyHash = {};
    this.props.home.features.forEach((f) => {
      f = this.props.home.featureById[f];
      [...f.components, ...f.actions, ...f.misc].forEach((ele) => {
        if (ele.name && ele.file && ele.name.toLowerCase().indexOf(key.toLowerCase()) >= 0) {
          arr.push(ele.file);
          this.matchedKeyHash[ele.file] = true;
        }
      });
    });
    this.matchedKeys = arr;
    return arr;
  }

  @autobind
  handleSelect(selected, evt) {
    const key = evt.node.props.eventKey;

    const hasChildren = !!_.get(evt, 'node.props.children');

    let expandedKeys = this.state.expandedKeys;
    let selectedKey = this.state.selectedKey;
    if (hasChildren) {
      if (expandedKeys.includes(key)) {
        expandedKeys = expandedKeys.filter(k => k !== key);
      } else {
        expandedKeys = [...expandedKeys, key];
      }
    } else {
      // key is the full file path
      selectedKey = key;

      if (evt.node.props.className === 'routes') {
        // TODO: handle routes click
        browserHistory.push(`/${key.replace('-routes', '')}/routes`);
      } else {
        const prjRoot = this.props.home.projectRoot;
        const ele = this.props.home.elementById[key];
        const file = key.replace(`${prjRoot}/src/features/${ele.feature}/`, '');

        browserHistory.push(`/element/${ele.feature}/${encodeURIComponent(file)}/diagram`);
      }
    }

    this.setState({
      selectedKey,
      expandedKeys,
    });
  }

  @autobind
  handleExpand(expanded, evt) {
    const key = evt.node.props.eventKey;

    let expandedKeys = this.state.expandedKeys;
    if (expandedKeys.includes(key)) {
      expandedKeys = expandedKeys.filter(k => k !== key);
    } else {
      expandedKeys = [...expandedKeys, key];
    }

    this.setState({
      expandedKeys,
    });
  }

  @autobind
  handleContextMenu(evt) {
    const menus = this.getMenuItems(evt.node);
    // const menus = this.getMenuItems(evt.node.props.pos);
    if (!menus.length) return;

    this.setState({
      contextMenu: menus,
    });

    // When right click, set the current tree node context
    this.createCmdContext(evt);

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

  @autobind
  handleMenuClick(evt) {
    console.log('menu click: ', evt);
    const cmdContext = this.cmdContext;
    const prjRoot = this.props.home.projectRoot;
    switch (evt.key) {
      case 'add-component':
      case 'add-action':
      case 'move':
      case 'rename':
        this.props.actions.showCmdDialog('cmd', {
          type: evt.key,
          ...this.cmdContext,
        });
        break;
      case 'run-test': {
        const relFile = cmdContext.file.replace(`${prjRoot}/`, '');
        browserHistory.push(`/tools/tests/${encodeURIComponent(relFile)}`);
        break;
      }
      case 'run-tests':
        if (!cmdContext.elementName) {
          browserHistory.push(`/tools/tests/${cmdContext.feature}%2F${cmdContext.elementType}`);
        } else if (cmdContext.elementType === 'feature') {
          browserHistory.push(`/tools/tests/${cmdContext.feature}`);
        }
        break;
      case 'del':
        Modal.confirm({
          title: 'Confirm',
          content: cmdContext.elementType === 'feature'
            ? `Delete ${cmdContext.elementType}: ${cmdContext.elementName} ? `
            : `Delete ${cmdContext.elementType}: ${cmdContext.feature}/${cmdContext.elementName} ? `,
          onOk: () => {
            const hide = message.loading(`Deleting ${cmdContext.elementName}`, 0);
            this.props.actions.execCmd({
              commandName: 'remove',
              type: cmdContext.elementType,
              name: cmdContext.elementType === 'feature'
                ? `${cmdContext.elementName}`
                : `${cmdContext.feature}/${cmdContext.elementName}`,
            })
            .then(() => {
              hide();
              cmdSuccessNotification({
                commandName: 'delete',
                type: cmdContext.elementType,
              }, this.props.actions.showCmdDialog);
            })
            .catch((e = 'Unknown error.') => {
              Modal.error({
                title: 'Failed to delete',
                content: e.toString(),
              });
            });
          }
        });

        break;
      default:
        break;
    }
  }

  highlightSearchKey(label) {
    const searchKey = this.props.searchKey;
    if (!searchKey) return label;
    const i = label.toLowerCase().indexOf(searchKey.toLowerCase());
    if (i === -1) return label;
    return (
      <span>
        {label.substring(0, i)}
        <span className="search-highlight">{label.substring(i, i + searchKey.length)}</span>
        {label.substring(i + searchKey.length, label.length)}
      </span>
    );
  }

  // renderTreeNodeTitle(label, icon, ...marks) {
  //   return (
  //     <span>
  //       {icon && <Icon type={icon} />}
  //       <label>{label}</label>
  //       {
  //         marks.filter(m => !!m).map(mark => <span key={mark.char} className="mark" style={{ backgroundColor: mark.color }}>{mark.char}</span>)
  //       }
  //     </span>
  //   );
  // }

  renderMiscFolder(folder, feature) {
    this.treeNodeData[folder.file] = { type: 'misc', feature, name: folder.file.split('/').pop() };
    const sk = this.props.searchKey;
    const miscArr = folder.children || [];

    return (
      (!sk || miscArr.length > 0) && <TreeNode className="misc" title={this.renderTreeNodeTitle(folder.name, 'folder')} key={folder.file}>
        {
          miscArr.map(miscItem => (
            miscItem.children ?
              this.renderMiscFolder(miscItem, feature)
            :
              <TreeNode className="misc-file" title={this.renderTreeNodeTitle(this.highlightSearchKey(miscItem.name), 'file')} key={miscItem.file} />
          ))
        }
      </TreeNode>
    );
  }

  renderFeatureNode(key) {
    const feature = this.props.home.featureById[key];
    let actionsArr = feature.actions;
    let componentsArr = feature.components;
    // let miscArr = feature.misc;
    const sk = this.props.searchKey;
    if (sk) {
      actionsArr = actionsArr.filter(action => this.matchedKeyHash[action.file]);
      componentsArr = componentsArr.filter(comp => this.matchedKeyHash[comp.file]);
      // miscArr = miscArr.filter(m => this.matchedKeyHash[m.file]);
    }
    this.treeNodeData = {
      ...this.treeNodeData,
      [`${key}-routes`]: { feature: key, type: 'routes', name: 'Routes' },
      [`${key}-actions`]: { feature: key, type: 'actions', name: 'Actions' },
      [`${key}-components`]: { feature: key, type: 'components', name: 'Components' },
    };

    const miscFolder = { children: feature.misc, name: 'Misc', file: `${key}-misc` };
    // NOTE! do not change tree node class name.
    const treeNodes = _.compact([
      !sk && <TreeNode className="routes" title={this.renderTreeNodeTitle(`Routes (${feature.routes.length})`, 'share-alt')} key={`${key}-routes`} />,
      (!sk || actionsArr.length > 0) && <TreeNode className="actions" title={this.renderTreeNodeTitle(`Actions (${actionsArr.length})`, 'notification')} key={`${key}-actions`}>
        {
          actionsArr.map(action => (
            <TreeNode type="action" className="action" title={this.renderTreeNodeTitle(this.highlightSearchKey(action.name), 'notification', action.isAsync && asyncMark)} key={action.file} />
          ))
        }
      </TreeNode>,
      (!sk || componentsArr.length > 0) && <TreeNode className="components" title={this.renderTreeNodeTitle(`Components (${componentsArr.length})`, 'appstore-o')} key={`${key}-components`}>
        {
          componentsArr.map(comp => (
            <TreeNode type="component" className="component" title={this.renderTreeNodeTitle(this.highlightSearchKey(comp.name), 'appstore-o', comp.connectToStore && connectMark)} key={comp.file} />
          ))
        }
      </TreeNode>,
      this.renderMiscFolder(sk ? this.filterMiscFolder(miscFolder, sk) : miscFolder, key),
    ]);
    return (
      treeNodes.length > 0 && <TreeNode className="feature" title={this.renderTreeNodeTitle(feature.name, 'book')} key={key}>
        {treeNodes}
      </TreeNode>
    );
  }

  renderLoading() {
    return (
      <div className="home-project-explorer">
        <Spin />
      </div>
    );
  }

  renderContextMenu() {
    return (
      <Menu
        style={{ minWidth: 150 }}
        onSelect={this.handleMenuClick}
        selectedKeys={[]}
      >
        {
          this.state.contextMenu.map(menuItem => <Menu.Item key={menuItem.key}>{menuItem.name}</Menu.Item>)
        }
      </Menu>
    );
  }

  // renderTreeNodes(nodesData) {
  //   console.log('render tree nodes: ', nodesData);

  //   return [
  //     <TreeNode title="abc" />
  //   ];
  // }

  renderTreeNodeTitle(nodeData) {
    const markDescription = {
      a: 'Async action',
      c: 'Connected to Redux store',
      r: 'Used in route config',
    };
    return (
      <span>
        {nodeData.icon && <Icon type={nodeData.icon} />}
        <label>{nodeData.label}{_.has(nodeData, 'count') ? ` (${nodeData.count})` : ''}</label>
        {
          nodeData.marks && nodeData.marks.map(mark => (
            <span
              key={mark}
              title={markDescription[mark.toLowerCase()]}
              className={`mark mark-${mark.toLowerCase()}`}
            >{mark}</span>
          ))
        }
      </span>
    );
  }

  @autobind
  renderTreeNode(nodeData) {
    // console.log('render tree node: ', nodeData);
    return (
      <TreeNode
        key={nodeData.key}
        title={this.renderTreeNodeTitle(nodeData)}
        className={nodeData.className}
        isLeaf={!nodeData.children}
      >
        {nodeData.children && nodeData.children.map(this.renderTreeNode)}
      </TreeNode>
    );
  }

  render() {
    const { features } = this.props.home;

    if (!features) {
      return this.renderLoading();
    }

    // if (this.props.searchKey) {
    //   this.createMatchedKeys();
    // }
    // const expandedKeys = this.getExpandedKeys();
    // console.log(expandedKeys);

    // const featuresNodes = _.compact(features.map(f => this.renderFeatureNode(f)));

    const treeData = getExplorerTreeData(this.props.home);
    const treeNodes = treeData.map(this.renderTreeNode);
    return (
      <div className="home-project-explorer" ref={(node) => { this.rootNode = node; }}>
        {treeNodes.length > 0 ? <Tree
          autoExpandParent={!!this.props.searchKey}
          selectedKeys={[this.state.selectedKey]}
          expandedKeys={this.state.expandedKeys}
          onRightClick={this.handleContextMenu}
          onSelect={this.handleSelect}
          onExpand={this.handleExpand}
        >
          {treeNodes}
        </Tree>
        : <div className="no-results">No results.</div>}
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
    actions: bindActionCreators({ ...actions, execCmd, showCmdDialog, dismissExecCmdError }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectExplorer);
