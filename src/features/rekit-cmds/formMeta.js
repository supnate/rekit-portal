import _ from 'lodash';

const baseMeta = {
  feature: { label: 'Feature', key: 'feature', type: 'string', widget: 'feature', required: true },
  name: { label: 'Name', key: 'name', type: 'string', widget: 'textbox', required: true },
  checkbox: { type: 'bool', widget: 'checkbox' },
  textbox: { type: 'string', widget: 'textbox' },
};

export default function getMeta(cmdType, context) {
  const meta = {
  };
  const fields = [];
  switch (cmdType) {
    case 'add-action':
      fields.push(
        { ...baseMeta.feature, initialValue: context.feature || null },
        { ...baseMeta.name },
        { ...baseMeta.checkbox, label: 'Async', key: 'isAsync', tooltip: 'Whether the action is async using redux-middleware-thunk.' },
      );
      break;
    case 'add-component':
      fields.push(
        { ...baseMeta.feature, initialValue: context.feature || null },
        { ...baseMeta.name },
        { ...baseMeta.checkbox, label: 'Connect store', key: 'connect', tooltip: 'Whether to connect to Redux store using react-redux' },
        { ...baseMeta.textbox, label: 'Url path', key: 'urlPath', tooltip: 'If provided, will create a route rule for React Route config.' },
      );
      break;
    case 'rename':
    case 'move':
      fields.push(
        { ...baseMeta.feature, initialValue: context.feature, key: 'targetFeature', label: 'Target feature' },
        { ...baseMeta.name, initialValue: context.name, key: 'targetName', label: 'New name' },
      );
      break;
    default:
      console.log('Unknown cmd type: ', cmdType);
      break;
  }

  meta.fields = _.compact(fields);

  return meta;
}
