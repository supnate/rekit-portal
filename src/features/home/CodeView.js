import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
// import Highlight from 'react-highlight';
import hljs from 'highlight.js';
import * as actions from './redux/actions';

export class CodeView extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
  };

  componentDidMount() {
    if (!this.getFileContent() && !this.props.home.fetchFileContentPending) {
      this.props.actions.fetchFileContent(this.props.file).catch((e) => {
        message.error({
          title: 'Failed to load file',
          content: e.toString(),
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.home.fileContentById[nextProps.file] && !nextProps.home.fetchFileContentPending) {
      this.props.actions.fetchFileContent(nextProps.file).catch((e) => {
        message.error({
          title: 'Failed to load file',
          content: e.toString(),
        });
      });
    }
  }

  componentDidUpdate() {
    if (this.codeNode) {
      hljs.highlightBlock(this.codeNode);
    }
  }

  getFileContent() {
    return this.props.home.fileContentById[this.props.file];
  }

  render() {
    const content = this.getFileContent();
    return (
      <div className="home-code-view">
        <pre><code className="jsx" style={{ height: 600 }} ref={(node) => { this.codeNode = node; }}>
          {content || '// Loading...'}
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
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeView);
