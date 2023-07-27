import { format, parseISO } from 'date-fns';
import { InAadressResponse, ParsedInAddressResponse } from './address-objects/address-objects-types';

export const getEstonianDateString = (dateString?: string | null): string =>
  dateString ? format(parseISO(dateString), 'dd.MM.yyyy') : '-';

export const parseInAddressResponse = (data: InAadressResponse): ParsedInAddressResponse[] => {
  if (!data.addresses) return [];

  return data.addresses.map(({ ads_oid, pikkaadress, viitepunkt_x, viitepunkt_y }) => ({ value: ads_oid, label: pikkaadress, coordinate: [+viitepunkt_x, +viitepunkt_y] }));
};
