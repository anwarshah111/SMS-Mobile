import moment from 'moment';

export const formatDateToReadable = (date: Date | string | number): string => {
  return moment(date).format('DD MMM, YYYY');
};
