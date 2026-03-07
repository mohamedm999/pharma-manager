import api from './axiosConfig';

export const fetchDashboardMetrics = async () => {
    // The endpoint is /ventes/dashboard/ since we added it to ventes/urls.py
    const response = await api.get('/ventes/dashboard/');
    return response.data;
};
