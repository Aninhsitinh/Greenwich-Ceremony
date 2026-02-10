import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect(token) {
        if (this.socket && this.connected) {
            console.log('Socket already connected');
            return this.socket;
        }

        const url = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

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
}

export default new SocketService();
