import { get } from '../api/fetch-wrapper';
import Cache from './cache';
import mixpanel from './mixpanel';

const requestOptions = {
  url: 'https://freegeoip.net/json/',
};

const _fetchIPInformation = () => {
  return get(requestOptions)
    .catch(error => {
      console.log('Error while fetching IP information', error);
      return Promise.reject({ message: "Could not fetch IP information" });
    });
};

const fetchIPInformation = () => {
  return Cache.get(Cache.keys.IP_INFORMATION)
    .catch(() => {
      return _fetchIPInformation()
        .then(ipData => {
          Cache.set(Cache.keys.IP_INFORMATION, ipData);
          const { data: { ip: distinctID } } = ipData;
          const profileProperties = Object.assign(
            { distinct_id: distinctID },
            ipData.data
          );
          mixpanel.profiles.set(profileProperties);
          return ipData;
        })
        .catch(error => {
          console.log('Error setting cache for IP_INFORMATION', error);
          return Promise.reject(error);
        });
    });
};

export default fetchIPInformation;
