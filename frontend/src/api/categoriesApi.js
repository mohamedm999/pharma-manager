import axiosInstance from './axiosConfig';

/**
 * Récupère la liste des catégories.
 * @returns {Promise<Array>} Liste des catégories
 */
export const fetchCategories = async () => {
    const response = await axiosInstance.get('/categories/');
    return response.data;
};

export const createCategorie = async (categorieData) => {
    const response = await api.post('/categories/', categorieData);
    return response.data;
};
