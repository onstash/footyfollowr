import React from 'react';

import FixtureDate from '../fixture-date';
import FixtureResult from '../fixture-result';
import AddToCalendar from '../add-to-calendar';
import FixtureTeams from '../fixture-teams';

import './styles.css';


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

const Fixture = ({
  homeTeamName,
  awayTeamName,
  date,
  matchday,
  status,
  result,
  timeFrame
}) => {
  return (
    <div className="fixture-container">
      <FixtureTeams homeTeam={homeTeamName} awayTeam={awayTeamName} />
      <FixtureResult {...result} />
      <FixtureDate date={date} status={status} />
    </div>
  );
};

export default Fixture;
