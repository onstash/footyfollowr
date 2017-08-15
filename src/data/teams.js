import { fetchCompetitionTeams as _fetchCompetitionTeams } from '../api/methods';

import Cache from '../utils/cache';

const fetchCompetitionTeams = competitionID => {
    const key = Cache.generateCacheKey(Cache.keys.TEAMS, competitionID);
    return Cache
      .get(key)
      .then(response => {
        // console.log('response (cache)', response);
        _fetchCompetitionTeams(competitionID)
          .then(apiResponse => Cache.set(key, apiResponse))
          .catch(error => console.log('error (api)', error));
        return response;
      }).catch(error => {
        // console.log('error (cache)', error);
        return _fetchCompetitionTeams(competitionID)
          .then(apiResponse => {
            // console.log('api response', apiResponse);
            Cache
              .set(key, apiResponse)
              .catch(error => console.log('error (cache)', error));
            return apiResponse;
          }).catch(Promise.reject);
      });
};

export default fetchCompetitionTeams;
