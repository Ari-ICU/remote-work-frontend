"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authService } from '@/lib/services/auth';
import { notificationService } from '@/lib/services/notification';
import { toast } from 'sonner';

interface Notification {
    id: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) return;

        // Fetch initial notifications
        notificationService.getAll().then(setNotifications).catch(console.error);

        // Connect to WebSocket
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001/notifications', {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('Connected to notification gateway');
            newSocket.emit('authenticate', user.id);
        });

        newSocket.on('newNotification', (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            toast.info("System Alert", {
                description: notification.message,
                icon: <span className="p-1 rounded-md bg-primary/20 text-primary">🔔</span>
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            // Assuming we add this to service
            // await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
