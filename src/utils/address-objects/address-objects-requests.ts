import { baseRequest, listRequestHandler } from '../base-requests';

export const getMunicipalities = async (): Promise<string[]> =>
  listRequestHandler<string>(
    baseRequest({
      method: 'GET',
      path: `api/classifier/municipalities`,
    })
  );

export const getCounties = async (): Promise<string[]> =>
  listRequestHandler<string>(
    baseRequest({
      method: 'GET',
      path: `api/classifier/counties`,
    })
  );
