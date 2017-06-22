import config from './config';
import { get } from './fetch-wrapper';

const generateRequestOptions = endpoint => {
  return {
    url: `${config.footballAPI.baseURL}${endpoint}`,
    headers: { 'X-Auth-Token': config.footballAPI.token }
  }
};

const apiRequest = endpoint =>
  get(generateRequestOptions(endpoint)).then(response => {
    return response.statusCode === 200 ? response : Promise.reject(response);
  });

export default apiRequest;