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
          setReviews(data);
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
