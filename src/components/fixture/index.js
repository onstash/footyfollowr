import React from 'react';

// import FixtureDate from '../fixture-date';
// import FixtureResult from '../fixture-result';
// import FixtureTeams from '../fixture-teams';
// import FixtureSubscription from '../fixture-subscription';

import AsyncComponentLoader from '../async-component-loader';

const FixtureDate = () =>
    import(/* webpackChunkName: "fixture-date" */'../fixture-date');
const FixtureResult = () =>
    import(/* webpackChunkName: "fixture-result" */'../fixture-result');
const FixtureTeams = () =>
    import(/* webpackChunkName: "fixture-teams" */'../fixture-teams');
const FixtureSubscription = () =>
    import(/* webpackChunkName: "fixture-subscription" */'../fixture-subscription');


const Dummy = () => <div />;

const Fixture = ({
  homeTeamName,
  awayTeamName,
  date,
  status,
  result,
  source,
  fixtureID
}) => {
  const timeDifferenceInMins = (new Date() - new Date(date)) / (1000 * 60);
  const isGameLive = timeDifferenceInMins > 0 && timeDifferenceInMins < 115;
  const className = isGameLive ? 'fa-fixture-container-live' : 'fa-fixture-container';
  const showNotificationsToggle = isGameLive === false && status !== 'FINISHED';
  const NotificationToggle = showNotificationsToggle ? FixtureSubscription : Dummy;
  // return (
  //   <div className={className}>
  //     <NotificationToggle
  //       fixtureID={fixtureID}
  //       date={date}
  //       homeTeamName={homeTeamName}
  //       awayTeamName={awayTeamName}
  //     />
  //     <FixtureTeams homeTeam={homeTeamName} awayTeam={awayTeamName} />
  //     <FixtureResult {...result} timeDifferenceInMins={timeDifferenceInMins} />
  //     <FixtureDate date={date} status={status} />
  //   </div>
  // );
  return (
    <div className={className}>
      <AsyncComponentLoader
        loadComponentModule={NotificationToggle}
        componentProps={{fixtureID, date, homeTeamName, awayTeamName}}
        componentName="NotificationToggle"
      />
      <AsyncComponentLoader
        loadComponentModule={FixtureTeams}
        componentProps={{homeTeam: homeTeamName, awayTeam: awayTeamName}}
        componentName="FixtureTeams"
      />
      <AsyncComponentLoader
        loadComponentModule={FixtureResult}
        componentProps={{timeDifferenceInMins, ...result}}
        componentName="FixtureResult"
      />
      <AsyncComponentLoader
        loadComponentModule={FixtureDate}
        componentProps={{date, status}}
        componentName="FixtureDate"
      />
    </div>
  );
};

export default Fixture;
