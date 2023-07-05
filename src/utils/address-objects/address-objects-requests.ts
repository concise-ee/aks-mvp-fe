import { baseRequest, listRequestHandler, objectRequestHandler } from '../base-requests';
import { County, Municipality } from '../types';
import { Accommodation, AccommodationFilter } from './address-objects';

export const getMunicipalities = async (): Promise<Municipality[]> =>
  listRequestHandler<Municipality>(
    baseRequest({
      method: 'GET',
      path: `api/classifier/municipalities`,
    })
  );

export const getCounties = async (): Promise<County[]> =>
  listRequestHandler<County>(
    baseRequest({
      method: 'GET',
      path: `api/classifier/counties`,
    })
  );

export const getAllAccommodations = async (): Promise<Accommodation[]> =>
  listRequestHandler<Accommodation>(
    baseRequest({
      method: 'GET',
      path: 'api/accommodation/',
    })
  );

export const getFilteredAccommodations = async (filter: AccommodationFilter): Promise<Accommodation[]> =>
  listRequestHandler<Accommodation>(
    baseRequest({
      method: 'POST',
      path: 'api/accommodation/filter',
      data: filter,
    })
  );

export const patchAccommodation = async (id: number): Promise<Accommodation | null> =>
  objectRequestHandler<Accommodation>(
    baseRequest({
      method: 'PATCH',
      path: `api/accommodation/update-address/${id}`,
    })
  );

export const getAddresses = async (query: string): Promise<any[]> =>
  listRequestHandler<any>(
    baseRequest({
      method: 'GET',
      baseUrl: 'https://inaadress.maaamet.ee/inaadress/gazetteer?address=',
      path: query,
    })
  );
