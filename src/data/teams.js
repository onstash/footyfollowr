import { fetchCompetitionTeams as _fetchCompetitionTeams } from '../api/methods';
import Cache from '../utils/cache';
const isDevelopment = process.env.NODE_ENV === 'development';

const fetchCompetitionTeams = competitionID => {
  const cacheKey = `TEAMS-${competitionID}`;
  return Cache.get(cacheKey)
    .then(({apiResponse, updatedAt}) => {
      const currentTime = new Date();
      if (((currentTime - new Date(updatedAt)) / 1000) < 900) {
        return apiResponse;
      }
      return _fetchCompetitionTeams(competitionID)
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
      return _fetchCompetitionTeams(competitionID)
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

export default fetchCompetitionTeams;
