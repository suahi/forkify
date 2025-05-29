import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJson = async function (url) {
  try {
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)]);
    const data = await res.json();
    // console.log(data);
    if (data.status === 'fail') throw Error(`${data.message}`);
    return data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

export const sendJson = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      timeout(TIMEOUT_SEC),
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
    ]);
    const data = await res.json();
    // console.log(data);
    if (data.status === 'fail') throw Error(`${data.message}`);
    return data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};
