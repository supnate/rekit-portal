/* eslint react/jsx-no-target-blank: 0 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Steps } from 'antd';

const Step = Steps.Step;

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
          <p><label>Created by <a href="https://github.com/supnate/rekit" target="_blank">Rekit:</a></label><span> v{rekit.version}</span></p>
          <p><label>Depends on <a href="https://github.com/supnate/rekit-core" target="_blank">Rekit Core:</a></label><span> v{rekit.coreVersion}</span></p>
          <p><label>Depends on <a href="https://github.com/supnate/rekit-portal" target="_blank">Rekit Portal:</a></label><span> v{rekit.portalVersion}</span></p>
        </div>

        <p className="feedback">
          Any questions or feedback? Please visit: <br />
          <a href="https://github.com/supnate/rekit" target="_blank">https://github.com/supnate/rekit</a>
        </p>
      </div>
    );
  }

  renderDemoAbout() {
    const rekit = this.props.home.rekit;
    return (
      <div className="home-about demo-version">
        <div className="header">
          <img className="logo" src={require('../../images/logo.png')} alt="logo" />
          <h1>Welcome to the Rekit Portal demo!</h1>
          <p className="version">Version: v{rekit.portalVersion}</p>
        </div>

        <p>
          This is a demo of Rekit and Rekit portal for you to quickly learn how Rekit helps to creating a scalable web application.
        </p>
        <br />
        <p>
          Rekit portal itself is also created by Rekit. It&apos;s a web application for managing a Rekit project. It not only provides web UIs for creating/moving/deleting elements of a Rekit app, but also provides tools for analyzing/building/testing a Rekit application.
        </p>
        <br />
        <h3>Create your own Rekit app with 3 only steps!</h3>
        <p>
          Though this demo is readonly, you can try a full-featured Rekit portal by creating your own Rekit app. It&apos;s super easy!
        </p>
        <br />
        <Steps>
          <Step status="process" title="Install rekit" description={<ul><li><span>&gt;</span> npm install rekit -g</li></ul>} />
          <Step status="process" title="Create app" description={<ul><li><span>&gt;</span> rekit create app1</li><li><span>&gt;</span> cd app1</li><li><span>&gt;</span> npm install</li></ul>} />
          <Step status="process" title="Start the app" description={<ul><li><span>&gt;</span> npm start</li></ul>} />
        </Steps>
        <br />
        <p>* Alternatively you can use <a href="https://yarnpkg.com/" target="_blank">Yarn</a> as the package manager instead of npm.</p>
        <br />
        <h3>Learn more</h3>
        <p className="learn-more">
          <ul>
            <li><a href="#">Rekit 2.0 is out with nice new features!</a></li>
            <li><a href="#">Rekit docs: rekit.js.org</a></li>
            <li><a href="#">Feature oriented web development with React, Redux and React-router</a></li>
            <li><a href="#">A new approach to managing Redux actions</a></li>
          </ul>
        </p>
        <br />
        <p>
          Any more questions or feedback? Please visit: <a href="https://github.com/supnate/rekit" target="_blank">https://github.com/supnate/rekit</a>
        </p>
      </div>
    );
  }
  render() {
    if (1||process.env.NODE_ENV === 'demo') {
      return this.renderDemoAbout();
    }
    return this.renderNormalAbout();
  }
}

export default connect(state => ({ home: state.home }))(About);
