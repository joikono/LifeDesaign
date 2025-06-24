import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    root: './src'  // proxy section removed since we're using Flask backend
});