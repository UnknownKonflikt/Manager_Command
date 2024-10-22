import { pool } from 'pg';




const pool = new pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

pool.connect()
    .then(() => {
        console.log('Connected to database successfully!');
    })
    .catch(err => {
        console.error('Error connecting to database', err.stack);
    });
export default pool;