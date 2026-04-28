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
