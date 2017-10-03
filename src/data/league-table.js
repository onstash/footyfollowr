import {
  fetchCompetitionLeagueTable as _fetchCompetitionLeagueTable
} from '../api/methods';
import Cache from '../utils/cache';
const isDevelopment = process.env.NODE_ENV === 'development';

const fetchCompetitionLeagueTable = (competitionID, filterParam) => {
  if (isDevelopment) {
    console.log('Data layer fetchCompetitionFixtures');
  }
  const cacheKey = `LEAGUE_TABLE-${competitionID}-${filterParam}`;
  return _fetchCompetitionLeagueTable(competitionID, filterParam)
    .then(apiResponse => {
      if (isDevelopment) {
        console.log('api response', apiResponse);
      }
      Cache.set(cacheKey, apiResponse)
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
          _fetchCompetitionLeagueTable(competitionID, filterParam)
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

export default fetchCompetitionLeagueTable;
