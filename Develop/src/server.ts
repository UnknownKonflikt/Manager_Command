const express = require('express');
const  { Client } = require('pg');
const departmentRoutes = require('./routes');
const dbConnection = require('./connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use('/routes', departmentRoutes);

// Routes   
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//Create new client instance
const client = new Client({
    user: 'your-username',
    host: 'localhost',
    database: 'manager_database_db',
    password: 'password',
    port: 5432, //Default PostgreSQL port
});

//Connect to database
client.connect()
    .then(() => {
        console.log('Connected to database successfully!');
    })
    .catch((err: Error) => {
        console.error('Connection error', err.stack);
    });

//Test the database connection

