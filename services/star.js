import { fetchWithAuth } from 'services/api';
import conf from 'conf/conf';
import { starApiConstants } from 'constants/api';
import { differenceInMinutes, parseISO } from 'date-fns';

export const getHours = async (bus, stop, destination) => {
  const response = await fetchWithAuth(conf.starApi.hoursToStopRecords, {
    where: `
      ${starApiConstants.smallLineName}="${bus}" 
      AND ${starApiConstants.stopName}="${stop}" 
      AND ${starApiConstants.destination}="${destination}"
    `,
    select: `
      ${starApiConstants.theoreticalArrival},
      ${starApiConstants.precision},
      ${starApiConstants.arrival},
       ${starApiConstants.id}
    `,
    sort: `${starApiConstants.arrival}`,
    rows: 4,
    pretty: false,
    timezone: 'UTC',
  });
  if (response.records) {
    return response.records.map(record => ({
      ...record.record.fields,
      minutesDiff: `${differenceInMinutes(
        parseISO(record.record.fields[starApiConstants.arrival]),
        Date.now()
      )}`,
    }));
  }
  return [];
};
