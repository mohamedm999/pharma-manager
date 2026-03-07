import api from './axiosConfig';

export const fetchMedicaments = async (params = {}) => {
    // params peut inclure { page: 1, categorie: id, search: 'doli' }
    const response = await api.get('/medicaments/', { params });
    return response.data;
};

export const createMedicament = async (medicamentData) => {
    const response = await api.post('/medicaments/', medicamentData);
    return response.data;
};

export const updateMedicament = async (id, medicamentData) => {
    // on utilise patch pour partial_update ou put pour update total
    const response = await api.patch(`/medicaments/${id}/`, medicamentData);
    return response.data;
};

export const deleteMedicament = async (id) => {
    const response = await api.delete(`/medicaments/${id}/`);
    return response.data;
};

export const fetchAlertes = async (params = {}) => {
    const response = await api.get('/medicaments/alertes/', { params });
    return response.data;
};
