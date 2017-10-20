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

export const post = requestOptions => {
  let statusCode;
  const headers = Object.assign(
    {},
    { 'Content-Type': 'application/json' },
    requestOptions.headers
  );
  const body = JSON.stringify(requestOptions.data);
  return fetch(requestOptions.url, {
    headers,
    body,
    method: 'post'
  })
  .then(response => {
    statusCode = response.status;
    return response.text();
  })
  .then(textResponse => {
    let jsonResponse = null;
    try {
      jsonResponse = JSON.parse(textResponse);
    } catch(e) {
      console.log('response', textResponse, 'payload', requestOptions);
      return Promise.reject(textResponse);
    }
    jsonResponse.statusCode = statusCode;
    return jsonResponse;
  });
};
