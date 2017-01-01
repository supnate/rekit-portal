import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Button, Modal } from 'antd';
import * as actions from './redux/actions';
import { LogViewer } from './';

export class LogViewerDialog extends Component {
  static propTypes = {
    rekitCmds: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onClose() {},
  };

  render() {
    return (
      <Modal
        visible
        maskClosable={false}
        footer=""
        onClose={this.props.onClose}
        wrapClassName="rekit-cmds-log-viewer-dialog"
        {...this.props}
      >
        <Alert message={this.props.rekitCmds.logsTitle} description={this.props.rekitCmds.logsDescription} type="success" showIcon />
        <LogViewer logs={this.props.rekitCmds.cmdLogs} />
        <div className="dialog-footer">
          <Button type="primary" onClick={this.props.onClose}>Close</Button>
        </div>
      </Modal>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    rekitCmds: state.rekitCmds,
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
)(LogViewerDialog);
