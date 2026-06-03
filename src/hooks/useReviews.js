import { useEffect, useState } from "react";
import { fetchReviews } from "../lib/api";

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchReviews()
      .then((data) => {
        if (mounted) {
          const list = Array.isArray(data)
            ? data
            : (data?.items ?? data?.reviews ?? []);
          setReviews(list);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { reviews, loading, error };
}
