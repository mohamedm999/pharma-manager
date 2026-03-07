import axiosInstance from './axiosConfig';

/**
 * Authentifie un utilisateur et retourne les tokens JWT.
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Les tokens { access, refresh }
 */
export const loginUser = async (username, password) => {
    const response = await axiosInstance.post('/auth/token/', { username, password });
    return response.data;
};

/**
 * Rafraîchit le token d'accès JWT.
 * @param {string} refresh - Le token de rafraîchissement
 * @returns {Promise<Object>} Le nouveau token d'accès
 */
export const refreshToken = async (refresh) => {
    const response = await axiosInstance.post('/auth/token/refresh/', { refresh });
    return response.data;
};
