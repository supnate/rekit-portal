import React, { PureComponent, PropTypes } from 'react';
import { Modal } from 'antd';

export default class CmdDialog extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <Modal
        visible
        maskClosable={false}
        footer=""
        wrapClassName="rekit-cmds-cmd-dialog"
        {...this.props}
      >
        {this.props.children}
      </Modal>
    );
  }
}
