import React, { Component } from 'react';
import { root } from 'react-nexus';
import styles from './styles.css';
import box from '../../assets/images/box.svg';
import Example from './Example';

class App extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.title}>
          <img className={styles.box} src={box} />
          {'JavaScript App'}
        </h1>
        <Example />
      </div>
    );
  }
}

export default root()(App);
