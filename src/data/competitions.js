import { fetchCompetitions as _fetchCompetitions } from '../api/methods';

import Cache from '../utils/cache';

const fetchCompetitions = () => {
  // console.log('Data layer fetchCompetitions');
  return Cache
    .get(Cache.keys.COMPETITIONS)
    .then(response => {
      // console.log('response (cache)', response);
      _fetchCompetitions()
        .then(apiResponse => Cache.set(Cache.keys.COMPETITIONS, apiResponse))
        .catch(error => console.log('error (api)', error));
      return response;
    }).catch(error => {
      // console.log('error (cache)', error);
      return _fetchCompetitions()
        .then(apiResponse => {
          // console.log('api response', apiResponse);
          Cache
            .set(Cache.keys.COMPETITIONS, apiResponse)
            .catch(error => console.log('error (cache)', error));
          return apiResponse;
        }).catch(Promise.reject);
    });
};

export default fetchCompetitions;
