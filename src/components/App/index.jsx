import React, { Component } from 'react';
import { root } from 'react-nexus';
import styles from './styles.css';

import Example from './Example';

class App extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.title}>{'Hello World !'}</h1>
        <Example />
      </div>
    );
  }
}

export default root()(App);
