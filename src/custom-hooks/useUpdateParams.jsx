import { useSearchParams } from "react-router-dom";

export function useUpdateParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return updateParam;
}

export function useBatchUpdateParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    for (const key in params) {
      const value = params[key];
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    }
    setSearchParams(newParams);
  };

  return updateParams;
}
