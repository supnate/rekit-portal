import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export class About extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
  };
  renderNormalAbout() {
    const rekit = this.props.home.rekit;
    return (
      <div className="home-about">
        <div className="header">
          <img className="logo" src={require('../../images/logo.png')} alt="logo" />
          <h3>Rekit Portal</h3>
          <p className="version">Version: v{rekit.portalVersion}</p>
        </div>

        <p>
          Rekit portal is a web application for managing a Rekit project. It not only provides web UIs for creating/moving/deleting elements of a Rekit app besides Rekit command line tools, but also provides tools for analysis/building/testing.
        </p>
        <div className="versions">
          <h5>Application Status</h5>
          <p><label>Created by <a href="https://github.com/supnate/rekit" target="_blank" rel="noopener noreferrer">Rekit:</a></label><span> v{rekit.version}</span></p>
          <p><label>Depends on <a href="https://github.com/supnate/rekit-core" target="_blank" rel="noopener noreferrer">Rekit Core:</a></label><span> v{rekit.coreVersion}</span></p>
          <p><label>Depends on <a href="https://github.com/supnate/rekit-portal" target="_blank" rel="noopener noreferrer">Rekit Portal:</a></label><span> v{rekit.portalVersion}</span></p>
        </div>

        <p className="feedback">
          Any questions or feedback? Please visit: <br />
          <a href="https://github.com/supnate/rekit" target="_blank" rel="noopener noreferrer">https://github.com/supnate/rekit</a>
        </p>
      </div>
    );
  }

  renderDemoAbout() {
    return (
      <div className="home-about">
        Demo About
      </div>
    );
  }
  render() {
    if (process.env.NODE_ENV === 'demo') {
      return this.renderDemoAbout();
    }
    return this.renderNormalAbout();
  }
}

export default connect(state => ({ home: state.home }))(About);
