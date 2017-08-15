// import {
//   fetchCompetition as _fetchCompetition,
//   fetchCompetitionTeams as _fetchCompetitionTeams,
//   fetchCompetitionLeagueTable as _fetchCompetitionLeagueTable,
//   fetchCompetitionFixtures as _fetchCompetitionFixtures,
//   fetchFixtures as _fetchFixtures,
//   fetchFixture as _fetchFixture,
//   fetchTeamFixtures as _fetchTeamFixtures,
//   fetchTeamPlayers as _fetchTeamPlayers
// } from '../api/methods';
//
// import Cache from '../utils/cache';

import fetchCompetitions from './competitions';
import fetchCompetition from './competition';
import fetchCompetitionFixtures from './fixtures';
import fetchCompetitionTeams from './teams';
import fetchCompetitionLeagueTable from './league-table';

const DataLayer = {
  fetchCompetitions,
  fetchCompetition,
  fetchCompetitionFixtures,
  fetchCompetitionTeams,
  fetchCompetitionLeagueTable
};

export default DataLayer;
