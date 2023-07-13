import { baseRequest, listRequestHandler, objectRequestHandler } from '../base-requests';
import { County, Municipality } from '../types';
import {
  Accommodation,
  AccommodationFilter,
  Address,
  InAadressResponse,
  NewAccommodation,
} from './address-objects-types';

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

export const getAccommodationHistory = async (id: number): Promise<Address[]> =>
  listRequestHandler<Address>(
    baseRequest({
      method: 'GET',
      path: `api/accommodation/address-history/${id}`,
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

export const patchAccommodation = async (id: number, adsId: string): Promise<Accommodation | null> =>
  objectRequestHandler<Accommodation>(
    baseRequest({
      method: 'PATCH',
      path: `api/accommodation/update-address/${id}`,
      data: { adsOid: adsId },
    })
  );

export const getAddresses = async (query: string): Promise<InAadressResponse | null> =>
  objectRequestHandler<InAadressResponse>(
    baseRequest({
      method: 'GET',
      baseUrl: 'https://inaadress.maaamet.ee/inaadress/gazetteer?address=',
      params: `${query}&features=KATASTRIYKSUS`,
    })
  );

export const getAddressByCoordinates = async (xCoord: number, yCoord: number): Promise<InAadressResponse | null> =>
  objectRequestHandler<InAadressResponse>(
    baseRequest({
      method: 'GET',
      baseUrl: 'https://inaadress.maaamet.ee/inaadress/gazetteer?',
      params: `x=${xCoord}&y=${yCoord}&features=KATASTRIYKSUS`,
    })
  );

export const addNewAccommodation = async (data: NewAccommodation): Promise<Accommodation | null> =>
  objectRequestHandler<Accommodation>(
    baseRequest({
      method: 'POST',
      path: 'api/accommodation/add-new',
      data,
    })
  );
