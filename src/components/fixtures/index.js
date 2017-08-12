import React from 'react';

import { fetchCompetitionFixtures } from '../../api/methods';

import TimeDifference from '../time-difference';

import './styles.css';

const dayFixtureStyles = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#999'
};

const DayFixtures = ({ fixtureDay, fixtures }) => (
  <div style={dayFixtureStyles}>
    {
      fixtures.map((fixture, index) =>
        <Fixture {...fixture} key={ index }/>
      )
    }
  </div>
);

const Fixture = ({ homeTeamName, awayTeamName, date, matchday, status }) => (
  <div className="fixture-container">
    <div className="fixture-teams">
      <div className="fixture-home-team">
        { homeTeamName }
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
    this.state = { loading: false, clubbedFixtures: {} };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    fetchCompetitionFixtures(this.props.match.params.id).then(response => {
      const { data: fixturesData } = response;
      const { fixtures } = fixturesData;
      const clubbedFixtures = {};
      fixtures.map(fixture => {
        const { matchday: matchDay } = fixture;
        if (clubbedFixtures[matchDay]) {
          clubbedFixtures[matchDay].push(fixture)
        } else {
          clubbedFixtures[matchDay] = [fixture];
        }
      });
      this.setState(() => ({ loading: false, clubbedFixtures }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  render() {
    const { loading, clubbedFixtures } = this.state;

    if (loading) {
      return <div>Loading</div>;
    }

    if (!clubbedFixtures) {
      return <div>{"There's something wrong!"}</div>;
    }

    return (
      <div className="fixtures">
        {
          Object.keys(clubbedFixtures).map(fixtureDay => {
            const dayFixtures = clubbedFixtures[fixtureDay];
            return (
              <DayFixtures
                key={fixtureDay}
                fixtureDay={fixtureDay}
                fixtures={dayFixtures}
              />
            );
          })
        }
      </div>
    )
  }
};

export default Fixtures;
