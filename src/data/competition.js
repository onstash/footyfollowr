import { fetchCompetition as _fetchCompetition } from '../api/methods';

const fetchCompetition = competitionID => _fetchCompetition(competitionID);

export default fetchCompetition;
