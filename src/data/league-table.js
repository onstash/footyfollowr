import {
  fetchCompetitionLeagueTable as _fetchCompetitionLeagueTable
} from '../api/methods';

import Cache from '../utils/cache';

const fetchCompetitionLeagueTable = (competitionID, filterParam) => {
  const key = Cache.generateCacheKey(
    Cache.keys.LEAGUE_TABLE, `${competitionID}&${filterParam}`
  );
  console.log('key', key);
  return Cache
    .get(key)
    .then(response => {
      console.log('response (cache)', response);
      _fetchCompetitionLeagueTable(competitionID, filterParam)
        .then(apiResponse => Cache.set(key, apiResponse))
        .catch(error => console.log('error (api)', error));
      return response;
    }).catch(error => {
      console.log('error (cache)', error);
      return _fetchCompetitionLeagueTable(competitionID, filterParam)
        .then(apiResponse => {
          console.log('api response', apiResponse);
          Cache
            .set(key, apiResponse)
            .catch(error => console.log('error (cache)', error));
          return apiResponse;
        }).catch(Promise.reject);
    });
};

export default fetchCompetitionLeagueTable;
