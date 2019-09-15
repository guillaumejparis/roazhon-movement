import secret from '../secret';
const starApi = {
  baseUrl: 'https://data.explore.star.fr/api/v2',
  hoursToStopRecords:
    'https://data.explore.star.fr/api/v2/catalog/datasets/tco-bus-circulation-passages-tr/records',
  topologyStopsRecords:
    'https://data.explore.star.fr/api/v2/catalog/datasets/tco-bus-topologie-pointsarret-td/records',
  topologyLinesRecords:
    'https://data.explore.star.fr/api/v2/catalog/datasets/tco-bus-topologie-lignes-td/records',
  topologyRoutesRecords:
    'https://data.explore.star.fr/api/v2/catalog/datasets/tco-bus-topologie-parcours-td/records',
  topologyServesRecords:
    'https://data.explore.star.fr/api/v2/catalog/datasets/tco-bus-topologie-dessertes-td/records',
};
const devConf = {
  starApi,
  starApiKey: secret.starApiKey,
};

const prodConf = {
  starApi,
  starApiKey: secret.starApiKey,
};

const conf = () => {
  if (__DEV__) {
    return devConf;
  }
  return prodConf;
};

export default conf();
