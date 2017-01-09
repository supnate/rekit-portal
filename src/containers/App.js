import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider, message, Modal, Spin } from 'antd';
import { ProjectExplorer } from '../features/home';
import DialogPlace from '../features/rekit-cmds/DialogPlace';
import { fetchProjectData } from '../features/home/redux/actions';

/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router. The default one is a two columns layout.
  You should adjust it acording to the type of your app.
*/

export class App extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  componentDidMount() {
    this.props.actions.fetchProjectData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.home.projectDataNeedReload && !nextProps.home.fetchProjectDataError && !nextProps.home.fetchProjectDataPending) {
      const hide = message.loading('Reloading project explorer...');
      this.props.actions.fetchProjectData()
      .then(hide)
      .catch((e) => {
        console.log('failed to fetch project data: ', e);
        Modal.error({
          title: 'Failed to refresh project data',
          content: 'Please try to refresh the whole page.',
        });
      });
    }
  }

  renderLoading() {
    return (
      <div className="app loading">
        <Spin />
        <span style={{ marginLeft: 20 }}>Loading...</span>
      </div>
    );
  }

  render() {
    if (!this.props.home.features) {
      return this.renderLoading();
    }

    return (
      <LocaleProvider locale={enUS}>
        <div className="app">
          <div className="sidebar">
            <ProjectExplorer />
          </div>
          <div className="page-container">
            {this.props.children}
          </div>
          <DialogPlace />
        </div>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchProjectData }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
