import React from 'react';

import { fetchCompetitionFixtures } from '../../api/methods';

import TimeDifference from '../time-difference';

import './styles.css';

const Fixture = ({ homeTeamName, awayTeamName, date, matchday, status }) => (
  <div className="fixture-container">
    <div className="fixture-teams">
      <div className="fixture-home-team">
        { homeTeamName }
      </div>
      <div className="fixture-team-divider">
        vs
      </div>
      <div className="fixture-away-team">
         { awayTeamName }
      </div>
    </div>
    <div className="fixture-match-day">
      <div className="fixture-match-day-label">
        Day
      </div>
      <div className="fixture-match-day-value">
        { matchday }
      </div>
    </div>
    <div className="fixture-date">
      <TimeDifference timeStampString={date} />
    </div>
  </div>
);

class Fixtures extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, fixtures: [] };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    fetchCompetitionFixtures(this.props.match.params.id).then(response => {
      const { data: fixturesData } = response;
      const { fixtures } = fixturesData;
      this.setState(() => ({ loading: false, fixtures }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  render() {
    const { loading, fixtures } = this.state;

    if (loading) {
      return <div>Loading</div>;
    }

    if (!fixtures) {
      return <div>{"There's something wrong!"}</div>;
    }

    return (
      <div className="fixtures">
        {
          fixtures.map((fixture, index) =>
            <Fixture {...fixture} key={ index }/>
          )
        }
      </div>
    );
  }
};

export default Fixtures;
