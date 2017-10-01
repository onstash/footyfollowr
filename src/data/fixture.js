import { fetchFixture as _fetchFixture } from '../api/methods';
import Cache from '../utils/cache';

const isDevelopment = process.env.NODE_ENV === 'development';

const fetchFixture = competitionID => {
  if (isDevelopment) {
    console.log('Data layer fetchFixture');
  }
  return _fetchFixture(competitionID)
    .then(apiResponse => {
      if (isDevelopment) {
        console.log('api response', apiResponse);
      }
      Cache
        .set(Cache.keys.FIXTURE, apiResponse)
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
        .get(Cache.keys.FIXTURE)
        .then(response => {
          if (isDevelopment) {
            console.log('response (cache)', response);
          }
          _fetchFixture(competitionID)
            .then(apiResponse => Cache.set(Cache.keys.FIXTURE, apiResponse))
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
