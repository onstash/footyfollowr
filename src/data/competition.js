import { fetchCompetition as _fetchCompetition } from '../api/methods';

import Cache from '../utils/cache';

const fetchCompetition = competitionID => {
  const key = Cache.generateCacheKey(Cache.keys.COMPETITION, competitionID);
  return Cache
    .get(key)
    .then(response => {
      // console.log('response (cache)', response);
      _fetchCompetition(competitionID)
        .then(apiResponse => Cache.set(key, apiResponse))
        .catch(error => console.log('error (api)', error));
      return response;
    }).catch(error => {
      // console.log('error (cache)', error);
      return _fetchCompetition(competitionID)
        .then(apiResponse => {
          // console.log('api response', apiResponse);
          Cache
            .set(key, apiResponse)
            .catch(error => console.log('error (cache)', error));
          return apiResponse;
        }).catch(Promise.reject);
    });
};

export default fetchCompetition;
