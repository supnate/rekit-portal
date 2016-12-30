import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Icon, Tree, Spin } from 'antd';

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

  render() {
    const { features } = this.props.home;

    if (!features) {
      return this.renderLoading();
    }

    return (
      <div className="home-navigator">
        <Tree
          onSelect={this.onSelect}
          defaultExpandedKeys={['product', 'opportunity', 'customer', 'lead', 'product-components']}
        >
          {
            features.map(f => this.renderFeatureNode(f))
          }
        </Tree>
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
