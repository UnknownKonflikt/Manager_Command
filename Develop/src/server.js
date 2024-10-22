var express = require('express');
var Client = require('pg').Client;
var departmentRoutes = require('./routes');
var dbConnection = require('./connection');
var app = express();
var PORT = process.env.PORT || 3001;
// Middleware
app.use(express.json());
app.use('/routes', departmentRoutes);
// Routes   
app.get('/', function (req, res) {
    res.send('Server is running!');
});
// Start server
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
//Create new client instance
var client = new Client({
    user: 'your-username',
    host: 'localhost',
    database: 'manager_database_db',
    password: 'password',
    port: 5432, //Default PostgreSQL port
});
//Connect to database
dbConnection.connect()
    .then(function () {
    console.log('Connected to database successfully!');
})
    .catch(function (err) {
    console.error('Error connecting to database', err.stack);
});
//Test the database connection
