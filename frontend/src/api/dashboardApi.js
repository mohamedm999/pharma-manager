import axiosInstance from './axiosConfig';

/**
 * Récupère les indicateurs clés pour le tableau de bord.
 * @returns {Promise<Object>} Statistiques et agrégations
 */
export const fetchDashboardMetrics = async () => {
    const response = await axiosInstance.get('/ventes/dashboard/');
    return response.data;
};
