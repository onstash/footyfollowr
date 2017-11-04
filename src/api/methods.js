import apiRequest from './api-request';

import config from './config';
import { get, post } from './fetch-wrapper';

const addQueryParam = (
  endpoint,
  queryParam,
  queryParamValue,
  isQueryParamAdded=false
) => {
  let queryParamSeparator = isQueryParamAdded ? '&' : '';
  return `${endpoint}${queryParamSeparator}?${queryParam}=${queryParamValue}`;
};

const fetchCompetitions = () => apiRequest('/competitions');

const fetchCompetitionTeams = id =>
  apiRequest(`/competitions/${id}/teams`);

const fetchCompetition = id => apiRequest(`/competitions/${id}`);

const fetchCompetitionLeagueTable = (id, matchDay='') => {
  let leagueTableEndpoint = `/competitions/${id}/leagueTable`;
  if (matchDay) {
    leagueTableEndpoint = addQueryParam(
      leagueTableEndpoint,
      'matchday',
      matchDay,
      false
    );
  }
  return apiRequest(leagueTableEndpoint);
};

const fetchCompetitionFixtures = (id, timeFrame='', leagueCode='') => {
  let competitionFixturesEndpoint = `/competitions/${id}/fixtures`;
  let queryParamAdded = false;
  if (timeFrame) {
    competitionFixturesEndpoint = addQueryParam(
        competitionFixturesEndpoint,
        'timeFrame',
        timeFrame,
        queryParamAdded
    );
    queryParamAdded = true;
  }
  if (leagueCode) {
    competitionFixturesEndpoint = addQueryParam(
        competitionFixturesEndpoint,
        'league',
        leagueCode,
        queryParamAdded
    );
  }
  return apiRequest(competitionFixturesEndpoint);
}

const fetchFixtures = () => apiRequest('/fixtures');

const fetchFixture = (id, headToHead='') => {
  let fixtureEndpoint = `/fixtures/${id}`;
  if (headToHead) {
    fixtureEndpoint = addQueryParam(
      fixtureEndpoint,
      'head2head',
      headToHead,
      false
    );
  }
  return apiRequest(fixtureEndpoint);
};

const fetchTeamFixtures = (id, timeFrame='', venue='', season='') => {
  let teamFixturesEndpoint = `/teams/${id}/fixtures`;
  let queryParamAdded = false;
  if (season) {
    teamFixturesEndpoint = addQueryParam(
      teamFixturesEndpoint,
      'season',
      season,
      queryParamAdded
    );
    queryParamAdded = true;
  }
  if (timeFrame) {
    teamFixturesEndpoint = addQueryParam(
      teamFixturesEndpoint,
      'timeFrame',
      timeFrame,
      queryParamAdded
    );
    queryParamAdded = true;
  }
  if (venue) {
    teamFixturesEndpoint = addQueryParam(
      teamFixturesEndpoint,
      'venue',
      venue,
      queryParamAdded
    );
  }
  return apiRequest(teamFixturesEndpoint);
};

const fetchTeamPlayers = id => apiRequest(`/teams/${id}/players`);

const subscribeToNotifications = payload => post({
  url: `${config.notificationsAPI.baseURL}/api/v1/subscribe`,
  data: payload
}).then(response => {
  return response.statusCode === 200 ? response : Promise.reject(response);
});

const checkSubscription = ({ fixtureID, fcmToken }) => {
  const endpoint = [
    `${config.notificationsAPI.baseURL}`,
    `/api/v1/check/${fixtureID}/${fcmToken}`
  ].join('');
  return get({ url: endpoint })
    .then(response => {
      console.error('response', response);
      return response.statusCode === 200 ? response.data : Promise.reject(response);
    });
};

export {
  fetchCompetitions,
  fetchCompetition,
  fetchCompetitionTeams,
  fetchCompetitionLeagueTable,
  fetchCompetitionFixtures,
  fetchFixtures,
  fetchFixture,
  fetchTeamFixtures,
  fetchTeamPlayers,
  subscribeToNotifications,
  checkSubscription
};
