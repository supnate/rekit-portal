import React, { Component, PropTypes } from 'react';
import enUS from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';
import routeConfig from '../common/routeConfig';
import Navigator from '../features/home/Navigator';
import DialogPlace from '../features/rekit-cmds/DialogPlace';
import { SimpleNav } from '../features/common';
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
      <LocaleProvider locale={enUS}>
        <div className="app">
          <div className="sidebar">
            <Navigator />
            <SimpleNav routes={routeConfig} />
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
