import { useState, useEffect, useCallback } from 'react';
import { fetchCategories } from '../api/categoriesApi';

const useCategories = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCategories();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refetch = () => loadData();

  return { data, loading, error, refetch };
};

export default useCategories;
