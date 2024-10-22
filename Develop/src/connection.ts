import dotenv from 'dotenv';
import pg from 'pg';
import inquirer from 'inquirer';

dotenv.config();
const {pool} =pg;
const {client } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

const connectToDatabase = async () => {
    try {
        await pool.connect();
        console.log('Connected to database successfully!');
    } catch (err) {
        console.error('Error connecting to database', err.stack);
    }
}