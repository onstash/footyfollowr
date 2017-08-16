import base64 from 'base-64'; //'./lib/base64';

import config from '../api/config';

const sendRequest = (urlPath, payload) => {
  let b64 = null;
  try {
    b64 = base64.encode(JSON.stringify(payload));
  } catch (e) {
    b64 = base64.encode(escape(JSON.stringify(payload)));
  }
  return fetch(`https://api.mixpanel.com${urlPath}/?data=${b64}`)
    .then(response => response.text())
    .then(r => {
      console.log('mixpanel.sendRequest[internal]', urlPath, payload, r);
    })
    .catch(console.log);
};

const _track = (event, properties = {}) => {
  return sendRequest('/track', {
      event,
      properties: Object.assign(properties, { token: config.mixpanel.token })
    })
    .then(() => console.log('/track', event, properties))
    .catch(e => console.log(e, event));
};

const track = (distinctID, event, properties = {}) => {
  if (!distinctID) {
    console.error('distinctID cannot be', distinctID);
    console.log('event', event);
    console.log('properties', properties);
  }
  _track(event, Object.assign({ distinct_id: distinctID }, properties));
};

const profiles = ({
  set: profileProperties => {
    profileProperties.created_at = new Date().toUTCString();
    const payload = {
      $set: profileProperties,
      $token: config.mixpanel.token,
      $distinct_id: profileProperties.distinct_id
    };
    return sendRequest('/engage', payload);
  }
});

const mixpanel = {
  track,
  profiles
};

export default mixpanel;
