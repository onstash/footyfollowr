import React from 'react';

import { Link } from 'react-router-dom';

import FixtureDate from '../fixture-date';
import FixtureResult from '../fixture-result';
import AddToCalendar from '../add-to-calendar';
import FixtureTeams from '../fixture-teams';


// const showCalendar = timeFrame !== 'p7';
// const calendarProps = showCalendar ? {
//   event: {
//     title: `${homeTeamName} vs ${awayTeamName}`,
//     startTime: (new Date(date)).getTime() / 1000,
//     endTime: (new Date(new Date(date).getTime() + 5400000)).getTime() / 1000,
//     description: '',
//     location: ''
//   },
//   timeFrame
// } : {};

// const calendarProps = {};
//
// <div className="fixture-calendar">
//   <AddToCalendar {...calendarProps} />
// </div>

const FixtureWrapper = ({
  className,
  source,
  fixtureID,
  children
}) => {
  if (source === 'MatchFixture') {
    return (
      <div className="fa-match-fixture-container">
        {children}
      </div>
    );
  }

  return (
    <Link
      to={`/fixtures/${fixtureID}`}
      className="fa-fixture-container"
    >
      {children}
    </Link>
  );
};

const Fixture = (props) => {
  const {
    homeTeamName,
    awayTeamName,
    date,
    matchday,
    status,
    result,
    timeFrame,
    className,
    source,
    fixtureID
  } = props;
  return (
    <FixtureWrapper className={className} source={source} fixtureID={fixtureID}>
      <FixtureTeams homeTeam={homeTeamName} awayTeam={awayTeamName} />
      <FixtureResult {...result} />
      <FixtureDate date={date} status={status} />
    </FixtureWrapper>
  );
};

export default Fixture;
