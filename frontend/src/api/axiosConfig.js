import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Logique globale d'erreur (ex: redirect si 401, toast global pour 500, etc.)
    console.error("API Error: ", error.response?.data || error.message);
    
    // On peut throw l'erreur pour laisser le composant appelant la gérer
    return Promise.reject(error);
  }
);

export default api;
