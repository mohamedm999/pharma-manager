import axiosInstance from './axiosConfig';

/**
 * Récupère la liste des catégories (sans pagination).
 * @returns {Promise<Array>} Liste des catégories
 */
export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories/');
  return response.data;
};

/**
 * Crée une nouvelle catégorie.
 * @param {Object} data - Données de la catégorie (nom, description)
 * @returns {Promise<Object>} La nouvelle catégorie
 */
export const createCategorie = async (data) => {
  const response = await axiosInstance.post('/categories/', data);
  return response.data;
};

/**
 * Met à jour une catégorie existante.
 * @param {number} id - ID de la catégorie
 * @param {Object} data - Données mises à jour (nom, description)
 * @returns {Promise<Object>} La catégorie mise à jour
 */
export const updateCategorie = async (id, data) => {
  const response = await axiosInstance.put(`/categories/${id}/`, data);
  return response.data;
};

/**
 * Supprime une catégorie.
 * Échoue si des médicaments y sont associés (PROTECT).
 * @param {number} id - ID de la catégorie
 */
export const deleteCategorie = async (id) => {
  const response = await axiosInstance.delete(`/categories/${id}/`);
  return response.data;
};
