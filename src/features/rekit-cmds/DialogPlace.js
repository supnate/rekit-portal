import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { CmdDialog, CmdForm, cmdSuccessNotification, LogViewerDialog } from './';

export class DialogPlace extends Component {
  static propTypes = {
    rekitCmds: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  @autobind
  handleCmdDialogDone(dialogType) {
    this.props.actions.hideDialog(dialogType);
  }

  @autobind
  handleCmdSuccess(dialogType) {
    this.props.actions.hideCmdDialog(dialogType);
    const { args } = this.props.rekitCmds.execCmdResult;
    cmdSuccessNotification(args, this.props.actions.showCmdDialog);
  }

  render() {
    const { rekitCmds } = this.props;
    const { hideCmdDialog } = this.props.actions;
    return (
      <div className="rekit-cmds-dialog-place">
        {rekitCmds.cmdDialogVisible &&
          <CmdDialog title={rekitCmds.cmdArgs.type} onClose={() => hideCmdDialog('cmd')}>
            <CmdForm
              onCancel={() => hideCmdDialog('cmd')}
              onDone={() => this.handleCmdSuccess('cmd')}
            />
          </CmdDialog>
        }
        {rekitCmds.logViewerDialogVisible &&
          <LogViewerDialog onClose={() => hideCmdDialog('logViewer')} />
        }
      </div>
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
)(DialogPlace);
