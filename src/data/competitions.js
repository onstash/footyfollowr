import { fetchCompetitions as _fetchCompetitions } from '../api/methods';
import Cache from '../utils/cache';

const isDevelopment = process.env.NODE_ENV === 'development';

const fetchCompetitions = () => {
  if (isDevelopment) {
    console.log('Data layer fetchCompetitions');
  }
  return Cache
    .get(Cache.keys.COMPETITIONS)
    .then(response => {
      if (isDevelopment) {
        console.log('response (cache)', response);
      }
      // _fetchCompetitions()
      //   .then(apiResponse => Cache.set(Cache.keys.COMPETITIONS, apiResponse))
      //   .catch(error => {
      //     if (isDevelopment) {
      //       console.log('error (api)', error);
      //     }
      //   });
      return response;
    }).catch(error => {
      if (isDevelopment) {
        console.log('error (cache)', error);
      }
      return _fetchCompetitions()
        .then(apiResponse => {
          if (isDevelopment) {
            console.log('api response', apiResponse);
          }
          Cache
            .set(Cache.keys.COMPETITIONS, apiResponse)
            .catch(error => {
              if (isDevelopment) {
                console.log('error (cache)', error);
              }
            });
          return apiResponse;
        }).catch(Promise.reject);
    });
};

export default fetchCompetitions;
