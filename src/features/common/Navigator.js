import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Icon, Tree } from 'antd';

const TreeNode = Tree.TreeNode;

const keys = ['0-0-0', '0-0-1', '0-0'];

const connectMark = { char: 'C', color: '#2175bc', title: 'Connect' };
const routeMark = { char: 'R', color: '#f90', title: 'Route' };
const asyncMark = { char: 'A', color: '#259b24', title: 'Async' };
export default class Navigator extends PureComponent {
  static propTypes = {

  };

  static defaultProps = {
    keys: ['0-0-0', '0-0-1'],
  };
  state = {
    defaultExpandedKeys: keys,
  };

  onSelect(info) {
    console.log('selected', info);
  }

  renderTreeNodeTitle(label, icon, ...marks) {
    return (
      <span>
        {icon && <Icon type={icon} />}
        <label title={label}>{label}</label>
        {
          marks.map(mark => <span key={mark.char} className="mark" style={{ backgroundColor: mark.color }}>{mark.char}</span>)
        }
      </span>
    );
  }

  renderFeatureNode(name) {
    const keyName = _.kebabCase(name);
    return (
      <TreeNode title={this.renderTreeNodeTitle(name)} key={keyName}>
        <TreeNode className="constants" title={this.renderTreeNodeTitle('Constants', 'bars')} key={`${keyName}-constants`} />
        <TreeNode className="routes" title={this.renderTreeNodeTitle('Routes', 'share-alt')} key={`${keyName}-routes`} />
        <TreeNode className="actions" title={this.renderTreeNodeTitle('Actions', 'notification')} key={`${keyName}-actions`}>
          <TreeNode title={this.renderTreeNodeTitle('asyncAction', '', asyncMark)} />
        </TreeNode>
        <TreeNode className="components" title={this.renderTreeNodeTitle('Components', 'appstore-o')} key={`${keyName}-components`}>
          <TreeNode title={this.renderTreeNodeTitle('TitleBarTitleBar', '', connectMark, routeMark)} />
          <TreeNode title="TitleBar" />
          <TreeNode title="TitleBar" />
          <TreeNode title="TitleBar" />
        </TreeNode>
      </TreeNode>
    );
  }

  render() {
    return (
      <div className="common-navigator">
        <Tree
          onSelect={this.onSelect}
          defaultExpandedKeys={['product', 'opportunity', 'customer', 'lead', 'product-components']}
        >
          {this.renderFeatureNode('Product')}
          {this.renderFeatureNode('Opportunity')}
          {this.renderFeatureNode('Customer')}
          {this.renderFeatureNode('Lead')}
        </Tree>
      </div>
    );
  }
}
