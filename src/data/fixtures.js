import { fetchCompetitionFixtures as _fetchCompetitionFixtures } from '../api/methods';

const fetchCompetitionFixtures = (competitionID, filterParam) =>
  _fetchCompetitionFixtures(competitionID, filterParam);

export default fetchCompetitionFixtures;
