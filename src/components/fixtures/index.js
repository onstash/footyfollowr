import React from 'react';

import DataLayer from '../../data';

import TimeDifference from '../time-difference';
import FixtureResult from '../fixture-result';
import AddToCalendar from '../add-to-calendar';

import './styles.css';

const collateFixtures = fixtures => {
  const oldFixtures = {};
  const upcomingFixtures = {};
  fixtures.forEach(fixture => {
    const { matchday: matchDay, status } = fixture;
    const target = status === 'FINISHED' ? oldFixtures : upcomingFixtures;
    if (target[matchDay]) {
      target[matchDay].push(fixture)
    } else {
      target[matchDay] = [fixture];
    }
  });
  return { oldFixtures, upcomingFixtures };
};

const DayFixtures = ({ fixtureDay, fixtures, team, timeFrame }) => {
  const filteredFixtures = team ? fixtures.filter(({
      awayTeamName, homeTeamName
    }) => awayTeamName === team || homeTeamName === team
  ) : fixtures;
  return (
    <div className="day-fixture-container">
      <div className="fixture-match-day">
        <div className="fixture-match-day-label">
          Week
        </div>
        <div className="fixture-match-day-value">
          { fixtureDay }
        </div>
      </div>
      <div className="day-fixture">
        {
          filteredFixtures.map((fixture, index) =>
            <Fixture {...fixture} key={ index } timeFrame={timeFrame} />
          )
        }
      </div>
    </div>
  );
};

const Fixture = ({
  homeTeamName, awayTeamName, date, matchday, status, result, timeFrame
}) => {
  const fixtureClassName = status === 'FINISHED' ? 'old' : 'upcoming';
  const showCalendar = timeFrame !== 'p7';
  const calendarProps = showCalendar ? {
    event: {
      title: `${homeTeamName} vs ${awayTeamName}`,
      startTime: date,
      endTime: new Date(new Date(date).getTime() + 5400000),
      description: '',
      location: ''
    },
    timeFrame
  } : {};
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
      <div className="fixture-calendar">
        <AddToCalendar {...calendarProps} />
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
      ],
      allTeams: {},
      teams: [],
      team: null,
      teamID: null
    };
  }

  componentDidMount() {
    const { timeFrame } = this.state;
    this.setState(() => ({ loading: true }));
    const competitionFixturesPromise = DataLayer.fetchCompetitionFixtures(
      this.props.match.params.id, timeFrame
    );
    const competitionTeamsPromise = DataLayer.fetchCompetitionTeams(
      this.props.match.params.id
    );
    Promise.all([competitionFixturesPromise, competitionTeamsPromise])
      .then(([fixturesResponse, teamsResponse]) => {
        const { data: { teams: teamsList } } = teamsResponse;
        const allTeams = {};
        const teams = [{ label: 'All teams', value: 'all-teams' }];
        teamsList.forEach(team => {
          const { name, _links: { self: { href: teamLink } } } = team;
          const teamLinkParts = teamLink.split('/');
          const teamID = teamLinkParts[teamLinkParts.length - 1];
          allTeams[`${teamID}`] = name;
          teams.push({ label: name, value: teamID });
        });
        const { data: fixturesData } = fixturesResponse;
        const { fixtures } = fixturesData;
        const { oldFixtures, upcomingFixtures } = collateFixtures(fixtures);
        this.setState(() => ({
          loading: false,
          oldFixtures,
          upcomingFixtures,
          teams,
          allTeams
        }));
      }).catch(error => {
        this.setState(() => ({ loading: false }));
      });
  }

  handleTimeFrameSelection(event) {
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
    const { timeFrame: oldTimeFrame, teamID, allTeams } = this.state;
    if (newTimeFrame === oldTimeFrame) {
      return;
    }
    const fetchFixturesPromise = (
      teamID !== null ?
      DataLayer.fetchTeamFixtures(teamID, newTimeFrame) :
      DataLayer.fetchCompetitionFixtures(
        this.props.match.params.id, newTimeFrame
      )
    );
    fetchFixturesPromise
      .then(response => {
        const { data: fixturesData } = response;
        const { fixtures } = fixturesData;
        const { oldFixtures, upcomingFixtures } = collateFixtures(fixtures);
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

  handleTeamSelection(event) {
    event.preventDefault();
    const teamID = event.target.value;
    const { team, allTeams, timeFrame } = this.state;
    const selectedTeam = allTeams[teamID];
    if (team === selectedTeam) {
      return;
    }
    this.setState(() => ({ team: selectedTeam }));
  }

  render() {
    const {
      loading,
      upcomingFixtures,
      oldFixtures,
      timeFrame,
      timeFrameLabel,
      fixtureFilters,
      teams,
      team
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
          <select
            onChange={(event) => this.handleTimeFrameSelection(event)}
          >
            {
              fixtureFilters.map(({ label, timeFrame: value }, index) =>
                <option value={value} key={index}>
                  {label}
                </option>
              )
            }
          </select>
          <select
            onChange={(event) => this.handleTeamSelection(event)}
          >
            {
              teams.map(({ label, value }, index) =>
                <option value={value} key={index}>
                  {label}
                </option>
              )
            }
          </select>
        </div>
        <div className="fixtures">
          {
            Object.keys(fixtures).map(fixtureDay => {
              const dayFixtures = fixtures[fixtureDay];
              return (
                <DayFixtures
                  key={fixtureDay}
                  timeFrame={timeFrame}
                  team={team}
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
