import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { AddActionForm, CmdDialog, CmdForm, LogViewerDialog } from './';


export class DialogsPlace extends Component {
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
    this.props.actions.showCmdDialog('logViewer');
  }

  render() {
    const { rekitCmds } = this.props;
    const { hideCmdDialog } = this.props.actions;
    return (
      <div className="rekit-cmds-dialogs-place">
        {rekitCmds.addActionDialogVisible &&
          <CmdDialog title="Add action" onClose={() => hideCmdDialog('addAction')}>
            <AddActionForm
              onCancel={() => hideCmdDialog('addAction')}
              onDone={() => this.handleCmdSuccess('addAction')}
            />
          </CmdDialog>
        }
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
)(DialogsPlace);
