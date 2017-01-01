import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Checkbox, Form, Input, Modal, Select } from 'antd';
import * as actions from './redux/actions';

const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export class AddActionForm extends Component {
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
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      this.props.actions.execCmd({
        ...values,
        isAsync: !!values.isAsync,
        type: 'add-action',
      }).then(() => {
        this.props.onDone();
      }).catch(() => {
        Modal.error({
          title: 'Failed to add action',
          content: <span style={{ color: 'red', wordBreak: 'break-all' }}>{this.props.rekitCmds.execCmdError}</span>,
        });
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { home, rekitCmds } = this.props;
    return (
      <div className="rekit-cmds-add-action-form">
        <Form
          horizontal
          onSubmit={this.handleSubmit}
        >
          <Form.Item
            {...formItemLayout}
            label="Feature"
          >
            {getFieldDecorator('feature', {
              initialValue: (rekitCmds.cmdArgs && rekitCmds.cmdArgs.feature) || home.features[0],
            })(
              <Select disabled={rekitCmds.execCmdPending}>
                {home.features.map(f => (
                  <Option key={home.featureById[f].key}>{home.featureById[f].name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Name"
          >
            {getFieldDecorator('name', {
              initialValue: 'test',
              rules: [{ required: true, message: 'Please input the name' }],
            })(
              <Input placeholder="Name" disabled={rekitCmds.execCmdPending} />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Async"
          >
            {getFieldDecorator('isAsync', {

            })(
              <Checkbox disabled={rekitCmds.execCmdPending} />
            )}
          </Form.Item>
          <div className="form-footer">
            <Button type="ghost" onClick={this.props.onCancel}>Cancel</Button>
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
    rekitCmds: state.rekitCmds,
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
)(Form.create()(AddActionForm));
