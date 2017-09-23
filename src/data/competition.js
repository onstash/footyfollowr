import { fetchCompetition as _fetchCompetition } from '../api/methods';

import Cache from '../utils/cache';

const fetchCompetition = competitionID => _fetchCompetition(competitionID);

export default fetchCompetition;
