import { fetchCompetition as _fetchCompetition } from '../api/methods';
import Cache from '../utils/cache';

const isDevelopment = process.env.NODE_ENV === 'development';

const fetchCompetition = competitionID => {
  const cacheKey = `COMPETITION-${competitionID}`;
  return Cache.get(cacheKey)
    .then(({ apiResponse, updatedAt }) => {
      const currentTime = new Date();
      if (((currentTime - new Date(updatedAt)) / 1000) < 900) {
        return apiResponse;
      }
      return _fetchCompetition(competitionID)
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
      if (isDevelopment) {
        console.log('error (_fetchCompetition())', error);
      }
      return _fetchCompetition(competitionID)
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

export default fetchCompetition;
