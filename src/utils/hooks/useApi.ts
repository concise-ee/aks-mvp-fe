import { useEffect, useState } from 'react';

function useApi<T>(promise: () => Promise<T>, initialState: T, deps?: unknown[]): [T, boolean] {
  const [response, setResponse] = useState<T>(initialState);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, deps || []);

  const fetchData = async () => {
    setLoading(true);
    setResponse(await promise());
    setLoading(false);
  };

  return [response, loading];
}

export default useApi;
