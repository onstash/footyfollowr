import React from 'react';

import Fixture from '../fixture';
import FixtureMatchWeek from '../fixture-match-week';

import './styles.css';

const DayFixtures = ({ fixtureDay, fixtures, team, timeFrame }) => {
  const filteredFixtures = team ? fixtures.filter(({
      awayTeamName, homeTeamName
    }) => awayTeamName === team || homeTeamName === team
  ) : fixtures;
  return (
    <div className="day-fixtures-container">
      <FixtureMatchWeek number={fixtureDay} />
      <div className="day-fixtures">
        {
          filteredFixtures.map((fixture, index) =>
            <Fixture {...fixture} key={ index } timeFrame={timeFrame} />
          )
        }
      </div>
    </div>
  );
};

export default DayFixtures;
