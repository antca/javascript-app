import React from 'react';
import { deps } from 'react-nexus';
import styles from './styles.css';

function TestMessage({ state }) {
  if(state.isPending()) {
    return <h2>{'Loading...'}</h2>;
  }
  if(state.isRejected()) {
    return <h2>{`Fail to get testState: ${state.reason}`}</h2>;
  }
  return (
    <h2>{state.value.message}</h2>
  );
}

function Test({ testState, refreshTest, refreshCountState }) {
  return (
    <div>
      <TestMessage state={testState} />
      <div>
        <button className={styles.button} onClick={refreshTest}>{'Refresh !'}</button>
        <span>{`Refreshed: ${refreshCountState.value} times !`}</span>
      </div>
    </div>
  );
}

export { Test, TestMessage };

export default deps(() => ({
  actions: {
    refreshTest: '/refresh/welcome',
  },
  stores: {
    testState: '/api/welcome',
    refreshCountState: '/refreshCounter',
  },
}))(Test);
