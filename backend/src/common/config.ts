import dotenv from 'dotenv';
dotenv.config();

export const HOST = process.env.HOST || 'localhost';

export const PORT = process.env.PORT || 3333;

export const NODE_ENV = process.env.NODE_ENV || 'dev';
