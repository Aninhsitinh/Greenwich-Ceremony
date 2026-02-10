import { defineStore } from 'pinia';
import { ref } from 'vue';
import socketService from '@/services/socketService';
import api from '@/services/api';

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([]);
    const unreadCount = ref(0);
    const loading = ref(false);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        loading.value = true;
        try {
            const response = await api.get('/notifications/me');
            if (response.data.success) {
                notifications.value = response.data.data.notifications;
                updateUnreadCount();
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            loading.value = false;
        }
    };

    // Add notification (from socket or API)
    const addNotification = (notification) => {
        // Avoid duplicates
        const exists = notifications.value.find(n => n._id === notification._id);
        if (!exists) {
            notifications.value.unshift(notification);
            updateUnreadCount();
            showToast(notification);
        }
    };

    // Mark as read
    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            const notification = notifications.value.find(n => n._id === id);
            if (notification) {
                notification.read = true;
                updateUnreadCount();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            notifications.value.forEach(n => n.read = true);
            unreadCount.value = 0;
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Update unread count
    const updateUnreadCount = () => {
        unreadCount.value = notifications.value.filter(n => !n.read).length;
    };

    // Show toast notification
    const showToast = (notification) => {
        // This will be handled by a Toast component
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/logo.png',
                badge: '/logo.png'
            });
        }
    };

    // Request notification permission
    const requestPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    };

    // Setup socket listeners
    const setupSocketListeners = () => {
        socketService.onNotification((notification) => {
            addNotification(notification);
        });

        socketService.onAnnouncement((announcement) => {
            addNotification({
                _id: announcement._id,
                title: 'New Announcement',
                message: announcement.title,
                type: 'announcement',
                read: false,
                createdAt: announcement.createdAt
            });
        });

        socketService.onRegistrationUpdate((data) => {
            addNotification({
                _id: data._id,
                title: 'Registration Status Update',
                message: `Your registration has been ${data.status}`,
                type: 'registration',
                read: false,
                createdAt: new Date()
            });
        });
    };

    // Clear notifications
    const clearAll = () => {
        notifications.value = [];
        unreadCount.value = 0;
    };

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        requestPermission,
        setupSocketListeners,
        clearAll
    };
});
