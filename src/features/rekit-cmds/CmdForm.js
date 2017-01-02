/*
  Summary:
    A general auto form to generate rekit command.
*/

import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Checkbox, Form, Icon, Input, Modal, Select, Tooltip } from 'antd';
import * as actions from './redux/actions';
import * as cmdFormHelper from './cmdFormHelper';

const Option = Select.Option;

export class CmdForm extends Component {
  static propTypes = {
    rekitCmds: PropTypes.object.isRequired,
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onDone: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onDone() {},
    onCancel() {},
  };

  @autobind
  handleSubmit(evt) {
    evt.preventDefault();
    console.log('form submit');
    const { cmdArgs } = this.props.rekitCmds;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }

      const args = cmdFormHelper.convertArgs(values, cmdArgs);
      console.log(args);
      this.props.actions.execCmd(args).then(() => {
        this.props.onDone();
      }).catch((e) => {
        console.log('Failed to exec cmd: ', e);
        Modal.error({
          title: 'Operation failed',
          content: <span style={{ color: 'red', wordBreak: 'break-all' }}>{this.props.rekitCmds.execCmdError}</span>,
        });
      });
    });
  }

  renderWidget(meta) {
    const { home, rekitCmds } = this.props;
    const disabled = rekitCmds.execCmdPending || meta.disabled;
    switch (meta.widget) {
      case 'feature':
        return (
          <Select disabled={disabled}>
            {home.features.map(f => (
              <Option key={home.featureById[f].key}>{home.featureById[f].name}</Option>
            ))}
          </Select>
        );
      case 'textbox':
        return <Input disabled={disabled} />;
      case 'checkbox':
        return <Checkbox disabled={disabled} />;
      default:
        return <span style={{ color: 'red' }}>Unknown widget: {meta.widget}</span>;
    }
  }

  @autobind
  renderFormItem(meta) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };

    let label;
    if (meta.tooltip) {
      label = (
        <span>
          {meta.label}
          <Tooltip title={meta.tooltip}> &nbsp;<Icon style={{ color: '#108ee9' }} type="question-circle-o" /></Tooltip>
        </span>
      );
    } else {
      label = meta.label;
    }

    const rules = [];
    if (meta.required) {
      rules.push({
        required: true,
        message: `${meta.label} is required.`,
      });
    }
    return (
      <Form.Item
        key={meta.key}
        {...formItemLayout}
        label={label}
      >
        {getFieldDecorator(meta.key, {
          initialValue: meta.initialValue,
          rules,
        })(
          this.renderWidget(meta)
        )}
      </Form.Item>
    );
  }

  render() {
    const { rekitCmds } = this.props;
    const cmdArgs = rekitCmds.cmdArgs;

    if (!cmdArgs) {
      // not ready
      return <div className="rekit-cmds-cmd-form" />;
    }

    const meta = cmdFormHelper.getMeta(cmdArgs.type, cmdArgs);

    return (
      <div className="rekit-cmds-cmd-form">
        <Form
          horizontal
          onSubmit={this.handleSubmit}
        >
          {
            meta.fields.map(this.renderFormItem)
          }
          <div className="form-footer">
            <Button type="ghost" onClick={this.props.onCancel} disabled={rekitCmds.execCmdPending}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={rekitCmds.execCmdPending}>
              {rekitCmds.execCmdPending ? 'Loading...' : 'Ok'}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
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
)(Form.create()(CmdForm));
