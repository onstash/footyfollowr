import { fetchFixture as _fetchFixture } from '../api/methods';
import Cache from '../utils/cache';

const isDevelopment = process.env.NODE_ENV === 'development';

const fetchFixture = competitionID => {
  const cacheKey = `FIXTURE-${competitionID}`;
  return Cache.get(cacheKey)
    .then(({apiResponse, updatedAt}) => {
      const currentTime = new Date();
      if (((currentTime - new Date(updatedAt)) / 1000) < 900) {
        return apiResponse;
      }
      return _fetchFixture(competitionID)
        .then(apiResponse => {
          const cacheData = {
            apiResponse,
            updatedAt: (new Date()).getTime()
          };
          Cache
            .set(cacheKey, cacheData)
            .catch(error => {
              if (isDevelopment) {
                console.log('error (Cache.set)', error);
              }
            });
          return apiResponse
        });
    }).catch(error => {
      return _fetchFixture(competitionID)
        .then(apiResponse => {
          const cacheData = {
            apiResponse,
            updatedAt: (new Date()).getTime()
          };
          Cache
            .set(cacheKey, cacheData)
            .catch(error => {
              if (isDevelopment) {
                console.log('error (Cache.set)', error);
              }
            });
          return apiResponse
        });
    });
};

export default fetchFixture;
