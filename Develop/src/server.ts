const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const  {client} = require('pg');
const departmantRoutes = require('./routes');

// Middleware
app.use(express.json());
app.use('/routes', departmantRoutes);

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
    .then (() => {
        console.log('Connected to database successfully!');
    })
    .catch(err => {
        console.error('Error connecting to database', err.stack);
    });

//Test the database connection

