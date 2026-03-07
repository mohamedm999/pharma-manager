import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../api/authApi';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Dans un cas réel, on décoderait le JWT pour récupérer les infos utilisateur
            setUser({ username: 'admin' });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const data = await loginUser(username, password);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setUser({ username });
        return data;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
