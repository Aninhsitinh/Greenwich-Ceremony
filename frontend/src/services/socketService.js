import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect(token, userId) {
        if (this.socket && this.connected) {
            console.log('Socket already connected');
            return this.socket;
        }

        let url = import.meta.env.VITE_SOCKET_URL || '/';
        if (import.meta.env.DEV && (url === '/' || url.includes('localhost'))) {
            // In dev, if using proxy, we should use the same origin as the app
            url = window.location.origin;
        }

        this.socket = io(url, {
            auth: {
                token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.connected = true;
            if (userId) {
                this.socket.emit('join', userId);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    // Notification events
    onNotification(callback) {
        if (this.socket) {
            this.socket.on('notification', callback);
        }
    }

    offNotification(callback) {
        if (this.socket) {
            this.socket.off('notification', callback);
        }
    }

    // Registration updates
    onRegistrationUpdate(callback) {
        if (this.socket) {
            this.socket.on('registration:updated', callback);
        }
    }

    // Ticket scanned event
    onTicketScanned(callback) {
        if (this.socket) {
            this.socket.on('ticket:scanned', callback);
        }
    }

    // Announcement broadcast
    onAnnouncement(callback) {
        if (this.socket) {
            this.socket.on('announcement', callback);
        }
    }

    // Chat message
    onChatMessage(callback) {
        if (this.socket) {
            this.socket.on('chat:message', callback);
        }
    }

    sendChatMessage(message) {
        if (this.socket) {
            this.socket.emit('chat:send', message);
        }
    }

    // Join chat room
    joinRoom(roomId) {
        if (this.socket) {
            this.socket.emit('chat:join', roomId);
        }
    }

    leaveRoom(roomId) {
        if (this.socket) {
            this.socket.emit('chat:leave', roomId);
        }
    }

    // Typing indicators
    sendTyping(roomId) {
        if (this.socket) {
            this.socket.emit('chat:typing', roomId);
        }
    }

    onTyping(callback) {
        if (this.socket) {
            this.socket.on('chat:typing', callback);
        }
    }

    // Generic event listener
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    isConnected() {
        return this.connected && this.socket?.connected;
    }

    checkOnlineStatus(userIds, callback) {
        if (this.socket && this.connected) {
            this.socket.emit('check:online_status', userIds, callback);
        } else {
            // If not connected, assume everyone is offline
            const offlineMap = {};
            userIds.forEach(id => { offlineMap[id] = false; });
            callback(offlineMap);
        }
    }
}

export default new SocketService();
