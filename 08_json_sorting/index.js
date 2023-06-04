const axios = require('axios');

const endpoints = [
  'https://jsonbase.com/sls-team/json-793',
  'https://jsonbase.com/sls-team/json-955',
	'https://ivalid-url',
  'https://jsonbase.com/sls-team/json-231',
  'https://jsonbase.com/sls-team/json-931',
  'https://jsonbase.com/sls-team/json-93',
  'https://jsonbase.com/sls-team/json-342',
  'https://jsonbase.com/sls-team/json-770',
  'https://jsonbase.com/sls-team/json-491',
  'https://jsonbase.com/sls-team/json-281',
  'https://jsonbase.com/sls-team/json-718',
  'https://jsonbase.com/sls-team/json-310',
  'https://jsonbase.com/sls-team/json-806',
  'https://jsonbase.com/sls-team/json-469',
  'https://jsonbase.com/sls-team/json-258',
  'https://jsonbase.com/sls-team/json-516',
  'https://jsonbase.com/sls-team/json-79',
	'https://ivalid-url-again',
  'https://jsonbase.com/sls-team/json-706',
  'https://jsonbase.com/sls-team/json-521',
  'https://jsonbase.com/sls-team/json-350',
  'https://jsonbase.com/sls-team/json-64'
];

async function queryEndpoint(endpoint) {
  let isDone = null;

  for (let i = 0; i < 3; i++) {
    try {
      const response = await axios.get(endpoint);
      const data = response.data;
      isDone = findIsDone(data);

      console.log(`[Success] ${endpoint}: isDone - ${isDone}`);
      break;
    } catch (error) {
      console.error(`[Fail] ${endpoint}: The endpoint is unavailable`);
    }
  }

  return isDone;
}

function findIsDone(data) {
  if (typeof data.isDone === 'boolean') {
    return data.isDone;
  } else if (typeof data === 'object') {
    for (const key in data) {
      if (typeof data[key] === 'object') {
        const isDone = findIsDone(data[key]);
        if (isDone !== null) {
          return isDone;
        }
      }
    }
  }

  return null;
}

async function queryEndpoints() {
  let trueCount = 0;
  let falseCount = 0;

  const queryPromises = endpoints.map(endpoint => queryEndpoint(endpoint));
  const results = await Promise.all(queryPromises);

  for (const isDone of results) {
    if (isDone === true) {
      trueCount++;
    } else if (isDone === false) {
      falseCount++;
    }
  }

  console.log(`Found True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

queryEndpoints();
