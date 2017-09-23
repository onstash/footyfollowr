import {
  fetchCompetitionLeagueTable as _fetchCompetitionLeagueTable
} from '../api/methods';

const fetchCompetitionLeagueTable = (competitionID, filterParam) =>
  _fetchCompetitionLeagueTable(competitionID, filterParam);

export default fetchCompetitionLeagueTable;
