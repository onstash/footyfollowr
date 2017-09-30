import React from 'react';

import FixtureDate from '../fixture-date';
import FixtureResult from '../fixture-result';
import FixtureTeams from '../fixture-teams';

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
    <div
      className="fa-fixture-container"
    >
      {children}
    </div>
  );
};

const Fixture = (props) => {
  const {
    homeTeamName,
    awayTeamName,
    date,
    status,
    result,
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
