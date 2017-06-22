import 'isomorphic-fetch';

export const get = requestOptions => {
  let statusCode;
  const { url, headers } = requestOptions;
  return fetch(url, {
    method: 'get',
    headers: headers || {}
  }).then(response => {
    statusCode = response.status;
    return response.text();
  }).then(textResponse => {
    let jsonResponse = null;
    try {
      jsonResponse = JSON.parse(textResponse);
      return Object.assign(
        {},
        { data: jsonResponse, statusCode }
      );
    } catch(error) {
      console.log('fetchWrapper JSON.parse error', error);
      console.log('textResponse', textResponse);
      return Promise.reject(error);
    }
  });
};
