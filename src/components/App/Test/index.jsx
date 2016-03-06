import React from 'react';
import { deps } from 'react-nexus';
import box from '../../../assets/images/box.svg';

function TestMessage({ state }) {
  if(state.isPending()) {
    return <span>{'Loading...'}</span>;
  }
  if(state.isRejected()) {
    return <span>{`Fail to get testState: ${state.reason}`}</span>;
  }
  return <span>{state.value.message}</span>;
}

function Test({ testState, refreshTest, refreshCountState }) {
  return (
    <div>
      <div>
        <TestMessage state={testState} />
        {' '}
        <span>{`Refreshed: ${refreshCountState.value} times !`}</span>
      </div>
      <button onClick={refreshTest}>{'Refresh'}</button>
      <img src={box} />
    </div>
  );
}

export default deps(() => ({
  actions: {
    refreshTest: '/test/refresh',
  },
  stores: {
    testState: '/api/test',
    refreshCountState: '/test/refreshCount',
  },
}))(Test);
