import { getDistance } from 'geolib';
import { sort } from 'js-flock';
import { useLocalStore } from 'mobx-react-lite';
import { starApiConstants } from 'constants/api';
import { getHours } from 'services/star';
import { checkNested } from 'services/utils';
import { storeStoredStops } from 'services/storage';
import storeLocation from './storeLocation';

export const createStore = () => {
  const stops = {
    stored: [],
    enriched: {},
    nearest: [],
    addStored(stop) {
      let findStoredLvl = false;
      store.stops.stored.forEach(({ stopName, stopList }, index) => {
        if (stopName === stop.stopName) {
          findStoredLvl = true;
          let findStopListLvl = false;
          stopList.forEach(({ stopId, buses }, stopListIndex) => {
            if (stopId === stop.stopId) {
              findStopListLvl = true;
              let findBusesLvl = false;
              buses.forEach(({ smallLineName, direction }) => {
                if (smallLineName === stop.smallLineName && direction === stop.direction) {
                  findBusesLvl = true;
                }
              });
              if (!findBusesLvl) {
                store.stops.stored[index].stopList[stopListIndex].buses.push({
                  smallLineName: stop.smallLineName,
                  destinationName: stop.destinationName,
                  destinationCity: stop.destinationCity,
                  direction: stop.direction,
                });
              }
            }
          });
          if (!findStopListLvl) {
            store.stops.stored[index].stopList.push({
              stopId: stop.stopId,
              buses: [
                {
                  destinationName: stop.destinationName,
                  destinationCity: stop.destinationCity,
                  smallLineName: stop.smallLineName,
                  direction: stop.direction,
                },
              ],
            });
          }
        }
      });
      if (!findStoredLvl) {
        store.stops.stored.push({
          id: store.stops.stored.length,
          stopName: stop.stopName,
          stopList: [
            {
              stopId: stop.stopId,
              buses: [
                {
                  destinationName: stop.destinationName,
                  destinationCity: stop.destinationCity,
                  smallLineName: stop.smallLineName,
                  direction: stop.direction,
                },
              ],
            },
          ],
        });
      }
      storeStoredStops(store.stops.stored);
    },
    setStored(stops) {
      store.stops.stored = stops;
    },
    get storedIdsFormattedString() {
      return store.stops.stored.reduce((all, storedStopContainer) => {
        storedStopContainer.stopList.forEach(storedStop => {
          all += `${all !== '' ? ' OR ' : ''}${starApiConstants.id}="${storedStop.stopId}"`;
        });
        return all;
      }, '');
    },
    get storedBusesNumber() {
      return store.stops.stored.reduce((all, storedStopContainer) => {
        storedStopContainer.stopList.forEach(stop => {
          stop.buses.forEach(() => (all += 1));
        });
        return all;
      }, 0);
    },
    async setEnriched(enrichedStops) {
      store.stops.enriched = await store.stops.stored.reduce((all, storedStopContainer) => {
        all[storedStopContainer.id] = {
          ...storedStopContainer,
          stopList: storedStopContainer.stopList.map(storedStop => ({
            ...storedStop,
            ...enrichedStops[storedStop.stopId],
          })),
        };
        return all;
      }, {});
    },
    get enrichedFormattedString() {
      let formattedString = '';
      Object.values(store.stops.enriched).forEach(({ stopList }) => {
        stopList.forEach(({ stopId, buses }) => {
          buses.forEach(({ smallLineName, direction }) => {
            if (formattedString !== '') {
              formattedString += ' OR ';
            }
            formattedString += `
              (${starApiConstants.smallLineName}="${smallLineName}" 
              AND ${starApiConstants.stopId}="${stopId}"
              AND ${starApiConstants.direction}=${direction})
            `;
          });
        });
      });
      return formattedString;
    },
    updateNearest() {
      const distances = Object.values(store.stops.enriched).reduce(
        (all, { id, stopList }) => [
          ...all,
          ...stopList.map(({ coordinates }) => ({
            id,
            meters: getDistance(storeLocation.location.coords, coordinates),
          })),
        ],
        []
      );
      const distancesSorted = [];
      sort(distances)
        .asc(({ meters }) => meters)
        .forEach(({ id }) => {
          if (!distancesSorted.includes(id)) {
            distancesSorted.push(id);
          }
        });
      store.stops.nearest = distancesSorted;
    },
    get nearestEnriched() {
      return store.stops.nearest.map(id => store.stops.enriched[id]);
    },
    get nearestEnrichedFormattedString() {
      let formattedString = '';
      store.stops.nearest.forEach(id => {
        const { stopList } = store.stops.enriched[id];
        stopList.forEach(({ stopId, buses }) => {
          buses.forEach(({ smallLineName, direction }) => {
            if (formattedString !== '') {
              formattedString += ' OR ';
            }
            formattedString += `
              (${starApiConstants.smallLineName}="${smallLineName}" 
              AND ${starApiConstants.stopId}="${stopId}"
              AND ${starApiConstants.direction}=${direction})
            `;
          });
        });
      });
      return formattedString;
    },
    async updateHours(nearest) {
      const hours = (await getHours(
        nearest ? store.stops.nearestEnrichedFormattedString : store.stops.enrichedFormattedString,
        store.stops.storedBusesNumber
      )).reduce((all, hour) => {
        if (!all[hour.stopId]) {
          all[hour.stopId] = {};
        }
        if (!all[hour.stopId][hour.smallLineName]) {
          all[hour.stopId][hour.smallLineName] = {};
        }
        if (!all[hour.stopId][hour.smallLineName][hour.direction]) {
          all[hour.stopId][hour.smallLineName][hour.direction] = {
            hours: [],
          };
        }
        all[hour.stopId][hour.smallLineName][hour.direction].hours.push({
          courseId: hour.courseId,
          minutesDiff: hour.minutesDiff,
          secondsDiff: hour.secondsDiff,
          precision: hour.precision,
        });

        return all;
      }, {});
      store.stops.enriched = Object.values(store.stops.enriched).map(
        ({ stopList, ...enrichedStop }) => ({
          ...enrichedStop,
          stopList: stopList.map(({ buses, ...stop }) => ({
            ...stop,
            buses: buses.map(bus => ({
              ...bus,
              hours: checkNested(hours, stop.stopId, bus.smallLineName, bus.direction, 'hours')
                ? hours[stop.stopId][bus.smallLineName][bus.direction].hours
                : [],
            })),
          })),
        })
      );
    },
    reset() {
      store.stops.stored = [];
      storeStoredStops([]);
      store.stops.nearest = [];
      store.stops.enriched = {};
    },
  };

  const store = useLocalStore(() => ({
    stops,
  }));

  return store;
};
