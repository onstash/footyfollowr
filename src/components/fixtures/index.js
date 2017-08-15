import React from 'react';

import DataLayer from '../../data';

import TimeDifference from '../time-difference';
import FixtureResult from '../fixture-result';

import './styles.css';

const DayFixtures = ({ fixtureDay, fixtures }) => {
  return (
    <div className="day-fixture-container">
      <div className="fixture-match-day">
        <div className="fixture-match-day-label">
          Day
        </div>
        <div className="fixture-match-day-value">
          { fixtureDay }
        </div>
      </div>
      <div className="day-fixture">
        {
          fixtures.map((fixture, index) =>
            <Fixture {...fixture} key={ index }/>
          )
        }
      </div>
    </div>
  );
};

const Fixture = ({ homeTeamName, awayTeamName, date, matchday, status, result }) => {
  const fixtureClassName = status === 'FINISHED' ? 'old' : 'upcoming';
  return (
    <div className={`fixture-container ${fixtureClassName}`}>
      <div className="fixture-teams">
        <div className="fixture-home-team">
          { homeTeamName }
        </div>
        <div className="fixture-away-team">
           { awayTeamName }
        </div>
      </div>
      <FixtureResult {...result} />
      <div className="fixture-date">
        <TimeDifference timeStampString={date} />
      </div>
    </div>
  );
};

class Fixtures extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      oldFixtures: {},
      upcomingFixtures: {},
      timeFrame: 'n7',
      timeFrameLabel: 'Next week',
      fixtureFilters: [
        { label: 'Next week', timeFrame: 'n7' },
        { label: 'Next 2 weeks', timeFrame: 'n14' },
        { label: 'Previous week', timeFrame: 'p7' }
      ]
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    const { timeFrame } = this.state;
    this.setState(() => ({ loading: true }));
    DataLayer.fetchCompetitionFixtures(this.props.match.params.id, timeFrame).then(response => {
      const { data: fixturesData } = response;
      const { fixtures } = fixturesData;
      const oldFixtures = {};
      const upcomingFixtures = {};
      fixtures.map(fixture => {
        const { matchday: matchDay, status } = fixture;
        const target = status === 'FINISHED' ? oldFixtures : upcomingFixtures;
        if (target[matchDay]) {
          target[matchDay].push(fixture)
        } else {
          target[matchDay] = [fixture];
        }
      });
      this.setState(() => ({ loading: false, oldFixtures, upcomingFixtures }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  handleSelection(event) {
    event.preventDefault();
    const newTimeFrame = event.target.value;
    let timeFrameLabel;
    switch (newTimeFrame) {
      case 'p7':
        timeFrameLabel = 'Previous week';
        break;
      case 'n14':
        timeFrameLabel = 'Next 2 weeks';
        break;
      default:
        timeFrameLabel = 'Next week';
        break;
    }
    const { timeFrame: oldTimeFrame } = this.state;
    if (newTimeFrame === oldTimeFrame) {
      return;
    }
    DataLayer.fetchCompetitionFixtures(this.props.match.params.id, newTimeFrame)
      .then(response => {
        const { data: fixturesData } = response;
        const { fixtures } = fixturesData;
        const oldFixtures = {};
        const upcomingFixtures = {};
        fixtures.map(fixture => {
          const { matchday: matchDay, status } = fixture;
          const target = status === 'FINISHED' ? oldFixtures : upcomingFixtures;
          if (target[matchDay]) {
            target[matchDay].push(fixture)
          } else {
            target[matchDay] = [fixture];
          }
        });
        this.setState(() => ({
          loading: false,
          oldFixtures,
          upcomingFixtures,
          timeFrame: newTimeFrame,
          timeFrameLabel
        }));
      }).catch(error => {
        this.setState(() => ({
          loading: false,
          timeFrame: newTimeFrame,
          timeFrameLabel
        }));
      });
  }

  render() {
    const {
      loading,
      upcomingFixtures,
      oldFixtures,
      timeFrame,
      timeFrameLabel,
      fixtureFilters
    } = this.state;

    if (loading) {
      return <h2 className="placeholder-message">Loading fixtures...</h2>;
    }

    const fixtures = timeFrame.indexOf('n') === -1 ? oldFixtures : upcomingFixtures;

    if (!fixtures) {
      return <div className="fixtures">{"There's something wrong!"}</div>;
    }

    return (
      <div className="fixtures-container">
        <h2 className="fixtures-heading">
          Fixtures
        </h2>
        <div className="fixtures-filter">
          <div className="fixtures-filter-label">
            Current schedule:
          </div>
          <div className="fixtures-filter-value">
            <select
              onChange={(event) => this.handleSelection(event)}
            >
              {
                fixtureFilters.map(({ label, timeFrame: value }, index) =>
                  <option value={value} key={index}>
                    {label}
                  </option>
                )
              }
            </select>
          </div>
        </div>
        <div className="fixtures">
          {
            Object.keys(fixtures).map(fixtureDay => {
              const dayFixtures = fixtures[fixtureDay];
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
      </div>
    );
  }
};

export default Fixtures;
