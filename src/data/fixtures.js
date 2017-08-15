import { fetchCompetitionFixtures as _fetchCompetitionFixtures } from '../api/methods';

import Cache from '../utils/cache';

const fetchCompetitionFixtures = (competitionID, filterParam) => {
  const key = Cache.generateCacheKey(
    Cache.keys.FIXTURES, `${competitionID}&${filterParam}`
  );
  return Cache
    .get(key)
    .then(response => {
      // console.log('response (cache)', response);
      _fetchCompetitionFixtures(competitionID, filterParam)
        .then(apiResponse => Cache.set(key, apiResponse))
        .catch(error => console.log('error (api)', error));
      return response;
    }).catch(error => {
      // console.log('error (cache)', error);
      return _fetchCompetitionFixtures(competitionID, filterParam)
        .then(apiResponse => {
          // console.log('api response', apiResponse);
          Cache
            .set(key, apiResponse)
            .catch(error => console.log('error (cache)', error));
          return apiResponse;
        }).catch(Promise.reject);
    });
};

export default fetchCompetitionFixtures;
