import { useState, useEffect, useCallback } from 'react';
import { fetchVentes } from '../api/ventesApi';

const useVentes = (initialFilters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const loadData = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchVentes(currentFilters);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Erreur lors du chargement des ventes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filters);
  }, [filters, loadData]);

  const refetch = () => loadData(filters);

  return { data, loading, error, refetch, filters, setFilters };
};

export default useVentes;
