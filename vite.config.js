import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    root: './src',  // Make sure Vite knows to look in the src folder
    server: {
        proxy: {
            '/proxyapi': {
                target: 'https://api.langflow.astra.datastax.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxyapi/, ''),
                headers: {
                    'Authorization': `Bearer ${process.env.APP_TOKEN}`
                }
            }
        },
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    }
});
