import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { API_BASE_URL } from './api';

window.Pusher = Pusher;

// Echo configuration
const echoConfig = {
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${API_BASE_URL}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    },
};

/**
 * Initialize Echo connection only if user is authenticated
 */
export function connectEcho() {
    const token = localStorage.getItem("token");
    if (token && !window.Echo) {
        // Update auth header with current token
        echoConfig.auth.headers.Authorization = `Bearer ${token}`;
        window.Echo = new Echo(echoConfig);
        console.log('[Echo] Connected to Pusher');
    }
}

/**
 * Disconnect Echo when user logs out
 */
export function disconnectEcho() {
    if (window.Echo) {
        window.Echo.disconnect();
        window.Echo = null;
        console.log('[Echo] Disconnected from Pusher');
    }
}

// Only auto-connect if user is already authenticated
const token = localStorage.getItem("token");
if (token) {
    connectEcho();
}
