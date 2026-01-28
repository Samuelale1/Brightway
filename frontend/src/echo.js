import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { API_BASE_URL } from './api';

window.Pusher = Pusher;

// Echo configuration
const echoConfig = {
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
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
        console.log('[Echo] Connected to Reverb');
    }
}

/**
 * Disconnect Echo when user logs out
 */
export function disconnectEcho() {
    if (window.Echo) {
        window.Echo.disconnect();
        window.Echo = null;
        console.log('[Echo] Disconnected from Reverb');
    }
}

// Only auto-connect if user is already authenticated
const token = localStorage.getItem("token");
if (token) {
    connectEcho();
}
