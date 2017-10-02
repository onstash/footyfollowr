import localStorage from 'localStorage';

// localStorage.clear();

const get = key => {
  let value;
  // console.log('inside Cache.get', key, localStorage);
  return new Promise((resolve, reject) => {
    const response = localStorage.getItem(key);
    if (!response) {
      return reject({
        message: `localStorage.getItem has return null`,
        key,
        response
      });
    }
    // console.log('cache response', response);
    try {
      value = JSON.parse(response);
      // console.log('JSON.parse response', value);
      return resolve(value);
    } catch(error) {
      console.log('JSON.parse error', error);
      return resolve(response);
    }
  }).catch(error => Promise.reject({
    message: `localStorage.getItem has failed`,
    key,
    error
  }));
};

const set = (key, value) => {
  const stringifiedValue = JSON.stringify(value);
  return new Promise((resolve, reject) => {
    localStorage.setItem(key, stringifiedValue);
    return get(key).then(resolve).catch(reject);
  });
  // return localStorage
  //   .setItem(key, value)
  //   .then(response => {
  //     console.log(`${key}-${stringifiedValue} were cached`);
  //   })
  //   .catch(error => Promise.reject({
  //     message: `localStorage.setItem has failed`,
  //     key,
  //     value
  //   }));
};

const generateCacheKey = (cacheKey, identifier) => {
  return `${cacheKey}:${identifier}`;
};

const keys = {
  COMPETITIONS: 'Competitions',
  MIXPANEL_DISTINCT_ID: 'MixpanelDistinctID',
  IP_INFORMATION: 'IPInformation',
  ONBOARDING_SHOWN: 'OnboardingShown'
};

const Cache = {
  get,
  set,
  keys,
  generateCacheKey
};

export default Cache;
