import moment from 'moment';

export const formatDateToReadable = (date: Date | string | number): string => {
  return moment(date).format('DD MMM, YYYY');
};

export const calculateAge = (dob: Date | string | number): number => {
  return moment().diff(moment(dob), 'years');
};
