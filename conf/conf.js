import secret from '../secret';

const devConf = {
  starApi: {
    baseUrl: 'https://data.explore.star.fr/api/v2',
    hoursToStopRecords:
      'https://data.explore.star.fr/api/v2/catalog/datasets/tco-bus-circulation-passages-tr/records',
  },
  starApiKey: secret.starApiKey,
};

const prodConf = {
  starApi: {
    baseUrl: 'https://data.explore.star.fr/api/v2',
    hoursToStopRecords:
      'https://data.explore.star.fr/api/v2/catalog/datasets/tco-bus-circulation-passages-tr/records',
  },
  starApiKey: secret.starApiKey,
};

const conf = () => {
  if (__DEV__) {
    return devConf;
  }
  return prodConf;
};

export default conf();
