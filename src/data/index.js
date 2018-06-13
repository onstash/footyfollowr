import fetchCompetitions from './competitions';
import fetchCompetition from './competition';
import fetchCompetitionFixtures from './fixtures';
import fetchCompetitionTeams from './teams';
import fetchCompetitionLeagueTable from './league-table';
import fetchFixture from './fixture';

const DataLayer = {
  fetchCompetitions,
  fetchCompetition,
  fetchCompetitionFixtures,
  fetchCompetitionTeams,
  fetchCompetitionLeagueTable,
  fetchFixture
};

export default DataLayer;
