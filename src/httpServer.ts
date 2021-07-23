import http from 'http';
import { app } from './express';

export const httpServer = http.createServer(app);
