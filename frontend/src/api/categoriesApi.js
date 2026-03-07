import api from './axiosConfig';

export const fetchCategories = async () => {
    const response = await api.get('/categories/');
    return response.data;
};

export const createCategorie = async (categorieData) => {
    const response = await api.post('/categories/', categorieData);
    return response.data;
};
