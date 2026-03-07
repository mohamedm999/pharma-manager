import axiosInstance from './axiosConfig';

/**
 * Récupère l'historique paginé des ventes.
 * @param {Object} params - Paramètres de filtrage temporels
 * @returns {Promise<Object>} Données paginées des ventes
 */
export const fetchVentes = async (params = {}) => {
    const response = await axiosInstance.get('/ventes/', { params });
    return response.data;
};

/**
 * Récupère les détails spécifiques d'une vente.
 * @param {number} id - Identifiant de la vente
 * @returns {Promise<Object>} Vente détaillée avec ses lignes
 */
export const fetchVenteDetail = async (id) => {
    const response = await axiosInstance.get(`/ventes/${id}/`);
    return response.data;
};

/**
 * Crée une nouvelle transaction de vente.
 * @param {Object} venteData - Payload de la vente
 * @returns {Promise<Object>} La nouvelle Vente
 */
export const createVente = async (venteData) => {
    const response = await axiosInstance.post('/ventes/', venteData);
    return response.data;
};

/**
 * Annule une vente existante via l'action DRF.
 * @param {number} id - ID de la vente
 * @returns {Promise<Object>} La vente annulée
 */
export const annulerVente = async (id) => {
    const response = await axiosInstance.post(`/ventes/${id}/annuler/`);
    return response.data;
};
