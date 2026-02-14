"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/services/auth';

interface AuthContextType {
    user: any | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<any>;
    register: (userData: any) => Promise<any>;
    logout: () => Promise<void>;
    refresh: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = () => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
    };

    useEffect(() => {
        // Initial load
        loadUser();

        // Listen for auth events from authService
        const handleAuthUpdate = () => {
            loadUser();
        };

        const handleAuthUnauthorized = () => {
            setUser(null);
            setIsLoading(false);
        };

        window.addEventListener('auth-update', handleAuthUpdate);
        window.addEventListener('auth-unauthorized', handleAuthUnauthorized);

        return () => {
            window.removeEventListener('auth-update', handleAuthUpdate);
            window.removeEventListener('auth-unauthorized', handleAuthUnauthorized);
        };
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        try {
            const data = await authService.login(credentials);
            if (data.user) {
                setUser(data.user);
            }
            return data;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: any) => {
        setIsLoading(true);
        try {
            const data = await authService.register(userData);
            if (data.user) {
                setUser(data.user);
            }
            return data;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const refresh = async () => {
        try {
            const data = await authService.refresh();
            if (data.user) {
                setUser(data.user);
            }
            return data;
        } catch (error) {
            console.error("Auth refresh failed:", error);
            setUser(null);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
