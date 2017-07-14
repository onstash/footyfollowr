import React from 'react';

import { fetchCompetition } from '../../api/methods';

import { Link } from 'react-router-dom';

import Teams from '../teams';
import Fixtures from '../fixtures';

class Competition extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competition: {} };
  }

  componentWillMount() {
    const { id } = this.props;
    if (!id) {
      return;
    }

    this.setState(() => ({ loading: true }));
    fetchCompetition(id).then(response => {
      const { data: competition } = response;
      this.setState(() => ({ loading: false, competition }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  showTeams() {
    const { id } = this.props;
    this.setState(() => ({
      teamsID: id,
      fixturesID: null,
      leagueTableID: null
    }));
  }

  showFixtures() {
    const { id } = this.props;
    this.setState(() => ({
      teamsID: null,
      fixturesID: id,
      leagueTableID: null
    }));
  }

  showLeagueTable() {
    const { id } = this.props;
    this.setState(() => ({
      teamsID: null,
      fixturesID: null,
      leagueTableID: id
    }));
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps;
    if (!id) {
      return;
    }

    this.setState(() => ({ loading: true }));
    fetchCompetition(id).then(response => {
      const { data: competition } = response;
      this.setState(() => ({ loading: false, competition }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Competition shouldComponentUpdate', this.state !== nextState);
    return this.state !== nextState;
  }

  render() {
    const { id } = this.props;
    if (!id) {
      return <div />;
    }

    const { loading, competition, teamsID, fixturesID, leagueTableID } = this.state;

    if (loading) {
      return <div>Loading</div>;
    }

    if (!competition) {
      return <div>There's something wrong!</div>;
    }

    const {
      caption,
      league,
      numberOfGames,
      numberOfMatchdays,
      currentMatchday
    } = competition;

    return (
      <div className="container">
        <h2 className="caption">
          { caption }
        </h2>
        <h3 className="games">
          { numberOfGames }
        </h3>
        <h4 className="match-day">
          { currentMatchday } / { numberOfMatchdays }
        </h4>
        <div>
          <button onClick={() => this.showTeams()}>
            Teams
          </button>
        </div>
        <div>
          <button onClick={() => this.showFixtures()}>
            Fixtures
          </button>
        </div>
        <div>
          <button onClick={() => this.showLeagueTable()}>
            League table
          </button>
        </div>
        <Teams id={teamsID} />
        <Fixtures id={fixturesID} />
      </div>
    );
  }
};

export default Competition;