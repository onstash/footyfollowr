import React from 'react';

import Fixture from '../fixture';
import FixtureMatchWeek from '../fixture-match-week';

const DayFixtures = ({ fixtureDay, fixtures, team, timeFrame }) => {
  const filteredFixtures = team ? fixtures.filter(({
      awayTeamName, homeTeamName
    }) => awayTeamName === team || homeTeamName === team
  ) : fixtures;

  if (!filteredFixtures.length) {
    return null;
  }

  return (
    <div className="fa-day-fixtures-container">
      <FixtureMatchWeek number={fixtureDay} />
      <div className="fa-day-fixtures">
        {
          filteredFixtures.map((fixture, index) => {
            const { _links: { self: { href: fixtureLink } } } = fixture;
            const fixtureLinkParts = fixtureLink.split("/");
            const fixtureID = Number(fixtureLinkParts[fixtureLinkParts.length - 1]);
            return (
              <Fixture
                {...fixture}
                key={ index }
                timeFrame={timeFrame}
                fixtureID={fixtureID}
                source="DayFixtures"
              />
            );
          })
        }
      </div>
    </div>
  );
};

export default DayFixtures;
