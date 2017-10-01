import { fetchCompetition as _fetchCompetition } from '../api/methods';
import Cache from '../utils/cache';

const isDevelopment = process.env.NODE_ENV === 'development';

const fetchCompetition = competitionID => {
  if (isDevelopment) {
    console.log('Data layer fetchCompetition');
  }
  return _fetchCompetition(competitionID)
    .then(apiResponse => {
      if (isDevelopment) {
        console.log('api response', apiResponse);
      }
      Cache
        .set(Cache.keys.COMPETITION, apiResponse)
        .catch(error => {
          if (isDevelopment) {
            console.log('error (Cache.set)', error);
          }
        });
      return apiResponse;
    }).catch(error => {
      if (isDevelopment) {
        console.log('error (_fetchCompetition())', error);
      }
      return Cache
        .get(Cache.keys.COMPETITION)
        .then(response => {
          if (isDevelopment) {
            console.log('response (cache)', response);
          }
          _fetchCompetition(competitionID)
            .then(apiResponse => Cache.set(Cache.keys.COMPETITION, apiResponse))
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

export default fetchCompetition;
