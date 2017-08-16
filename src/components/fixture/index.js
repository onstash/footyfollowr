import React from 'react';

import TimeDifference from '../time-difference';
import FixtureResult from '../fixture-result';
import AddToCalendar from '../add-to-calendar';
import FixtureTeams from '../fixture-teams';

import './styles.css';

const Fixture = ({
  homeTeamName,
  awayTeamName,
  date,
  matchday,
  status,
  result,
  timeFrame
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
      <FixtureTeams homeTeam={homeTeamName} awayTeam={awayTeamName} />
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

export default Fixture;
