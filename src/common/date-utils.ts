import * as moment from 'moment-timezone';

moment.tz.setDefault('Asia/Beirut');

export const convertUtcToBeirutTime = (utcTimestamp: string): string => {
    return moment(utcTimestamp).format('MM/DD/YYYY HH:mm:ss');
}
