import { fetchWithStarAuth } from 'services/api';
import conf from 'conf/conf';
import { starApiConstants } from 'constants/api';
import { differenceInMinutes, parseISO } from 'date-fns';
import { differenceInSeconds } from 'date-fns/esm';

export const getHours = async (busStops, busesNumber) => {
  const response = await fetchWithStarAuth(conf.starApi.hoursToStopRecords, {
    where: busStops,
    select: `
      ${starApiConstants.theoreticalArrival},
      ${starApiConstants.precision},
      ${starApiConstants.arrival},
      ${starApiConstants.courseId},
      ${starApiConstants.smallLineName},
      ${starApiConstants.direction},
      ${starApiConstants.stopId}
    `,
    sort: `${starApiConstants.arrival}`,
    rows: busesNumber * 3,
    pretty: false,
    timezone: 'UTC',
  });
  if (response.records) {
    return response.records.map(record => {
      const diffInMinutes = differenceInMinutes(
        parseISO(record.record.fields[starApiConstants.arrival]),
        Date.now()
      );
      const diffInSeconds =
        differenceInSeconds(parseISO(record.record.fields[starApiConstants.arrival]), Date.now()) -
        diffInMinutes * 60;
      return {
        smallLineName: record.record.fields[starApiConstants.smallLineName],
        direction: record.record.fields[starApiConstants.direction],
        theoreticalArrival: record.record.fields[starApiConstants.theoreticalArrival],
        precision: record.record.fields[starApiConstants.precision],
        arrival: record.record.fields[starApiConstants.arrival],
        courseId: record.record.fields[starApiConstants.courseId],
        stopId: Number(record.record.fields[starApiConstants.stopId]),
        minutesDiff: diffInMinutes >= 0 ? `${diffInMinutes}` : '0',
        secondsDiff:
          diffInMinutes >= 0 && diffInSeconds >= 0
            ? diffInSeconds < 10
              ? `0${diffInSeconds}`
              : `${diffInSeconds}`
            : '00',
      };
    });
  }
  return [];
};

export const getTopologyStops = async (storedStopsIdsFormattedString, setEnrichedStops) => {
  const response = await fetchWithStarAuth(conf.starApi.topologyStopsRecords, {
    where: storedStopsIdsFormattedString,
    select: `
      ${starApiConstants.coordinates},
      ${starApiConstants.id}
    `,
    pretty: false,
    timezone: 'UTC',
  });

  if (response.records) {
    await setEnrichedStops(
      response.records.reduce((all, record) => {
        const recordFields = record.record.fields;
        all[recordFields[starApiConstants.id]] = {
          coordinates: recordFields[starApiConstants.coordinates],
        };
        return all;
      }, {})
    );
  }
  return [];
};

export const getTopologyStop = async stopId => {
  const response = await fetchWithStarAuth(conf.starApi.topologyStopsRecords, {
    where: `${starApiConstants.id}="${stopId}"`,
    select: `
      ${starApiConstants.name},
      ${starApiConstants.city}
    `,
    pretty: false,
    timezone: 'UTC',
  });

  if (response.records.length) {
    const record = response.records[0].record.fields;
    return {
      name: record[starApiConstants.name],
      city: record[starApiConstants.city],
    };
  }
  return {};
};

export const getTopologyLines = async () => {
  const response = await fetchWithStarAuth(conf.starApi.topologyLinesRecords, {
    select: `
      ${starApiConstants.id},
      ${starApiConstants.smallName},
      ${starApiConstants.longName},
      ${starApiConstants.commercialFamilyName},
      ${starApiConstants.goingMainRouteId},
      ${starApiConstants.comingMainRouteId},
      ${starApiConstants.textLineColor},
      ${starApiConstants.lineColor}
    `,
    sort: `${starApiConstants.ticketingId}`,
    rows: 54,
    pretty: false,
    timezone: 'UTC',
  });

  if (response.records) {
    return await response.records.map(record => ({
      id: record.record.fields[starApiConstants.id],
      smallLineName: record.record.fields[starApiConstants.smallName],
      longLineName: record.record.fields[starApiConstants.longName],
      commercialFamilyName: record.record.fields[starApiConstants.commercialFamilyName],
      comingMainRouteId: record.record.fields[starApiConstants.comingMainRouteId],
      goingMainRouteId: record.record.fields[starApiConstants.goingMainRouteId],
      textLineColor: record.record.fields[starApiConstants.textLineColor],
      lineColor: record.record.fields[starApiConstants.lineColor],
    }));
  }
  return [];
};

export const getTopologyRoutes = async (goingRouteId, comingRouteId) => {
  const response = await fetchWithStarAuth(conf.starApi.topologyRoutesRecords, {
    where: `${starApiConstants.id}="${goingRouteId}" OR ${starApiConstants.id}="${comingRouteId}"`,
    select: `
      ${starApiConstants.id},
      ${starApiConstants.longDescription},
      ${starApiConstants.startStopId},
      ${starApiConstants.arrivalStopId},
      ${starApiConstants.direction}
    `,
    pretty: false,
    timezone: 'UTC',
  });

  if (response.records) {
    return await response.records.map(record => ({
      id: record.record.fields[starApiConstants.id],
      longDescription: record.record.fields[starApiConstants.longDescription],
      startStopId: record.record.fields[starApiConstants.startStopId],
      arrivalStopId: record.record.fields[starApiConstants.arrivalStopId],
      direction: record.record.fields[starApiConstants.direction],
    }));
  }
  return [];
};

export const getTopologyServes = async ({ routeId, smallLineName, direction }) => {
  const where = routeId
    ? `${starApiConstants.routeId}="${routeId}"`
    : `${starApiConstants.smallLineName}="${smallLineName}"`;
  const sort =
    direction !== undefined
      ? direction
        ? starApiConstants.order
        : `-${starApiConstants.order}`
      : starApiConstants.order;
  const response = await fetchWithStarAuth(conf.starApi.topologyServesRecords, {
    where,
    select: `
      ${starApiConstants.stopId},
      ${starApiConstants.stopName},
      ${starApiConstants.smallLineName}
    `,
    sort,
    rows: 100,
    pretty: false,
    timezone: 'UTC',
  });

  if (response.records) {
    return await response.records.map(record => ({
      stopId: record.record.fields[starApiConstants.stopId],
      stopName: record.record.fields[starApiConstants.stopName],
      smallLineName: record.record.fields[starApiConstants.smallLineName],
    }));
  }
  return [];
};
