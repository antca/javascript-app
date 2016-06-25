import React, { Component } from 'react';
import { connect } from 'react-redux';

import { increment, decrement } from '../../redux/counter/actions';

import styles from './Counter.css';

@connect(
  ({ counter }) => ({ counter }),
  { increment, decrement },
)
class Counter extends Component {
  render() {
    const { counter, increment, decrement } = this.props;
    return (
      <div className={styles.Counter}>
        <p>{`Counter: ${counter}`}</p>
        <button onClick={increment}>{'+'}</button>
        <button onClick={decrement}>{'-'}</button>
      </div>
    )
  }
}

export default Counter;
