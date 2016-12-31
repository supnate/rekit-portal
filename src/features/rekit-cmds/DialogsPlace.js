import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { AddActionForm, CmdDialog } from './';

export class DialogsPlace extends Component {
  static propTypes = {
    rekitCmds: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  @autobind
  handleCmdDialogDone(dialogType) {
    this.props.actions.hideDialog(dialogType);
  }

  render() {
    const cmds = this.props.rekitCmds;
    return (
      <div className="rekit-cmds-dialogs-place">
        {cmds.addActionDialogVisible &&
          <CmdDialog>
            <AddActionForm onDone={() => this.hideDialog('addAction')} />
          </CmdDialog>
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
