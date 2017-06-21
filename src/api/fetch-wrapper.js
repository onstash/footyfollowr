import 'isomorphic-fetch';

export const get = requestOptions => {
  let statusCode;
  const { url, headers } = requestOptions;
  return fetch(url, {
    method: 'get',
    headers: headers || {}
  }).then(response => {
    statusCode = response.status;
    return response
  }).then(textResponse => {
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(textResponse);
      jsonResponse.statusCode = statusCode;
      return jsonResponse;
    } catch(error) {
      console.log('fetchWrapper JSON.parse error', error);
      console.log('textResponse', textResponse);
      return Promise.reject(error);
    }
  });
};
