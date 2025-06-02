import { useEffect, useState } from "react";
import { useCounter } from "./useCounter";

export function useSimpleFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [count, refresh] = useCounter()

  useEffect(() => {
    setLoading(true);
    fetch("/api/ruter")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((error) => setError(error)) 
      .finally(() => setLoading(false));
  }, [url, count]);

  return { data, loading, error, refresh };
}