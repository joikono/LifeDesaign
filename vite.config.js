import { defineConfig } from 'vite';

export default defineConfig({
    root: './src',  // Make sure Vite knows to look in the src folder
    server: {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    }
    // Removed the proxy configuration since we're now using a local Python backend
});