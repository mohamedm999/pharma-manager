import axiosInstance from './axiosConfig';

/** 
 * Récupère la liste paginée des médicaments. 
 * @param {Object} params - Paramètres de filtrage (search, categorie, page) 
 * @returns {Promise<Object>} Données paginées des médicaments 
 */ 
export const fetchMedicaments = async (params = {}) => {
    const response = await axiosInstance.get('/medicaments/', { params });
    return response.data;
};

/** 
 * Crée un nouveau médicament. 
 * @param {Object} data - Données du médicament 
 */ 
export const createMedicament = async (data) => {
    const response = await axiosInstance.post('/medicaments/', data);
    return response.data;
};

export const updateMedicament = async (id, medicamentData) => {
    // on utilise patch pour partial_update ou put pour update total
    const response = await axiosInstance.patch(`/medicaments/${id}/`, medicamentData);
    return response.data;
};

export const deleteMedicament = async (id) => {
    const response = await axiosInstance.delete(`/medicaments/${id}/`);
    return response.data;
};

export const fetchAlertes = async (params = {}) => {
    const response = await axiosInstance.get('/medicaments/alertes/', { params });
    return response.data;
};
