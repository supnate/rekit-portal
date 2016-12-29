import React, { Component, PropTypes } from 'react';
import Navigator from '../features/common/Navigator';

/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router. The default one is a two columns layout.
  You should adjust it acording to the type of your app.
*/

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <Navigator />
        </div>
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
