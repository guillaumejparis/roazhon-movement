import conf from 'conf/conf';

const tranformUrlParams = urlParams =>
  Object.entries(urlParams).reduce(
    (all, [key, value], index, arr) => `${all}${key}=${value}${index < arr.length - 1 ? '&' : ''}`,
    ''
  );

const fetchWithStarAuth = async (url, urlParams, options) => {
  try {
    const response = await fetch(
      `${url}?${tranformUrlParams(urlParams)}&apikey=${conf.starApiKey}`,
      options
    );
    const json = await response.json();
    if (response.status !== 200) {
      throw json;
    }

    return json;
  } catch (e) {
    console.warn(e);
    return e;
  }
};

export { fetchWithStarAuth };
