import axios, { AxiosResponse, Method, ResponseType } from 'axios';

interface RequestPayload {
  method: Method;
  path?: string;
  data?: unknown;
  baseUrl?: string;
  contentType?: string;
  responseType?: ResponseType;
  withCredentials?: boolean;
  params?: string;
}

export const baseRequest = async ({
  method,
  path,
  data,
  baseUrl,
  contentType,
  params,
  responseType = 'json',
}: RequestPayload) => {
  // @ts-ignore
  const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : window.BE_URL;

  const options: Record<string, unknown> = {
    method,
    baseURL: (baseUrl || BASE_URL) + (params || ''),
    url: path || '',
    headers: {
      Accept: '*/*',
      'Content-Type': contentType || 'application/json',
    },
    responseType,
  };
  if (data) {
    options.data = data;
  }
  return axios(options);
};

export async function objectRequestHandler<T>(
  promise: Promise<AxiosResponse>,
  returnErrorBody?: boolean
): Promise<T | null> {
  try {
    const { data, status } = await promise;

    if (status === 200) {
      return data;
    }
  } catch (e) {
    if (returnErrorBody) {
      return (e as any).response;
    }
    console.error(e);
  }
  return null;
}

export async function listRequestHandler<T>(promise: Promise<AxiosResponse>): Promise<T[]> {
  try {
    const { data, status } = await promise;
    if (status === 200) {
      return data;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}
