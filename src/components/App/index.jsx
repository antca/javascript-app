import React, { Component } from 'react';
import { root } from 'react-nexus';
import styles from './styles.css';

import Test from '../Test';

class App extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.title}>{'Hello World !'}</h1>
        <Test />
      </div>
    );
  }
}

export default root()(App);
