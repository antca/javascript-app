import React, { Component } from 'react';
import { Link } from 'react-router';

class App extends Component {
  render() {
    return (
      <div>
        <Link to={'/counter'}>{'Counter'}</Link>
        {this.props.children}
      </div>
    );
  }
}

export default App;
