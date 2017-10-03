import { fetchFixture as _fetchFixture } from '../api/methods';
import Cache from '../utils/cache';

const isDevelopment = process.env.NODE_ENV === 'development';

const fetchFixture = competitionID => {
  if (isDevelopment) {
    console.log('Data layer fetchFixture');
  }
  const cacheKey = `FIXTURE-${competitionID}`;
  return _fetchFixture(competitionID)
    .then(apiResponse => {
      if (isDevelopment) {
        console.log('api response', apiResponse);
      }
      Cache
        .set(cacheKey, apiResponse)
        .catch(error => {
          if (isDevelopment) {
            console.log('error (Cache.set)', error);
          }
        });
      return apiResponse;
    }).catch(error => {
      if (isDevelopment) {
        console.log('error (_fetchFixture())', error);
      }
      return Cache
        .get(cacheKey)
        .then(response => {
          if (isDevelopment) {
            console.log('response (cache)', response);
          }
          _fetchFixture(competitionID)
            .then(apiResponse => Cache.set(cacheKey, apiResponse))
            .catch(error => {
              if (isDevelopment) {
                console.log('error (api)', error);
              }
            });
          return response;
        }).catch(error => {
          if (isDevelopment) {
            console.log('error (cache)', error);
          }
          return Promise.reject(error);
        });
    });
};

export default fetchFixture;
