import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Competitions from './components/competitions';
import Competition from './components/competition';
import Teams from './components/teams';
import Fixtures from './components/fixtures';
import LeagueTable from './components/league-table';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/competitions/:id/league-table" component={ LeagueTable }/>
          <Route exact path="/competitions/:id/fixtures" component={ Fixtures }/>
          <Route exact path="/competitions/:id/teams" component={ Teams }/>
          <Route exact path="/competitions/:id" component={ Competition }/>
          <Route exact path="/" component={ Competitions }/>
        </div>
      </Router>
    );
    // return (
    //   <div className="App">
    //     <div className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <h2>Welcome to React</h2>
    //     </div>
    //     <p className="App-intro">
    //       To get started, edit <code>src/App.js</code> and save to reload.
    //     </p>
    //   </div>
    // );
  }
}

export default App;
