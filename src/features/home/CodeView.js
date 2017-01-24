import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
import { fetchFileContent } from './redux/actions';

export class CodeView extends PureComponent {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.fetchFileContent(this.props).then(this.highlightCode);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchFileContent(nextProps);
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  getFileContent() {
    return this.props.home.fileContentById[this.props.file];
  }

  @autobind
  highlightCode() {
    const code = this.getFileContent();
    if (this.codeNode && code !== this.lastCode) {
      // hljs.highlightBlock(this.codeNode);
      Prism.highlightElement(this.codeNode);
      this.lastCode = code;
    }
  }

  fetchFileContent(props, force = false) {
    const home = props.home;
    if (
      (force || !_.has(home.fileContentById, props.file))
      && !home.fetchFileContentPending
    ) {
      return this.props.actions.fetchFileContent(this.props.file).catch((e) => {
        message.error({
          title: 'Failed to load file',
          content: e.toString(),
        });
      });
    }
    return Promise.resolve();
  }

  render() {
    const content = this.getFileContent();
    const ext = this.props.file.split('.').pop();
    const lang = { js: 'jsx', md: 'markdown' }[ext] || ext;
    console.log('lang: ', lang);
    return (
      <div className="home-code-view">
        <div className="file-path">{this.props.file}</div>
        <pre><code className={`language-${lang} line-numbers`} ref={(node) => { this.codeNode = node; }}>
          {typeof content === 'string' ? content : '// Loading...'}
        </code></pre>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchFileContent }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeView);
