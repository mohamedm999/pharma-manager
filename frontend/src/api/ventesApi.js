import api from './axiosConfig';

export const fetchVentes = async (params = {}) => {
    // params = { date_debut: 'YYYY-MM-DD', date_fin: 'YYYY-MM-DD', page: 1 }
    const response = await api.get('/ventes/', { params });
    return response.data;
};

export const fetchVenteDetail = async (id) => {
    const response = await api.get(`/ventes/${id}/`);
    return response.data;
};

export const createVente = async (venteData) => {
    // venteData: { lignes: [{ medicament: 1, quantite: 2 }, ...] }
    const response = await api.post('/ventes/', venteData);
    return response.data;
};

export const annulerVente = async (id) => {
    const response = await api.post(`/ventes/${id}/annuler/`);
    return response.data;
};
