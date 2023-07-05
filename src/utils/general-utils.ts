import { format, parseISO } from 'date-fns';

// eslint-disable-next-line import/prefer-default-export
export const getEstonianDateString = (dateString?: string | null): string =>
  dateString ? format(parseISO(dateString), 'dd.MM.yyyy') : '-';
