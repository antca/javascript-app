import React from 'react';
import { deps } from 'react-nexus';
import styles from './styles.css';

function TestMessage({ state }) {
  return (
    <p>
      {(() => {
        if(state.isPending()) {
          return 'Loading...';
        }
        if(state.isRejected()) {
          return `Fail to get testState: ${state.reason}`;
        }
        return state.value.message;
      })()}
    </p>
  );
}

function Test({ testState, refreshTest, refreshCountState }) {
  return (
    <div>
      <TestMessage state={testState} />
      <div>
        <button className={styles.button} onClick={refreshTest}>{'Refresh!'}</button>
        <span>{`Refreshed ${refreshCountState.value} times!`}</span>
      </div>
    </div>
  );
}

export default deps(() => ({
  actions: {
    refreshTest: '/refresh/welcome',
  },
  stores: {
    testState: '/api/welcome',
    refreshCountState: '/refreshCounter',
  },
}))(Test);
