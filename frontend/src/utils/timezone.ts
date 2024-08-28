import moment from 'moment-timezone';

import { Timezone } from 'src/types/timezone'; // Assume you save the interface in a types file

export const getTimezones = (): Timezone[] => {
  const timezones: Timezone[] = moment.tz.names().map((tz) => {
    const offset = moment.tz(tz).format('Z');
    return {
      label: tz.replace('_', ' '), // Replace underscores with spaces for better readability
      utc: `UTC${offset}`,
    };
  });

  return timezones;
};
