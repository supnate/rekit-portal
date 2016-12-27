import React, { PureComponent } from 'react';
import { Icon, Tree } from 'antd';

const TreeNode = Tree.TreeNode;

const keys = ['0-0-0', '0-0-1', '0-0'];
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

  render() {
    return (
      <div className="home-navigator">
        <Tree
          showLine
          onSelect={this.onSelect}
        >
          <TreeNode title={<span><Icon type="setting" /> Hahaha</span>} key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0" disabled>
              <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
