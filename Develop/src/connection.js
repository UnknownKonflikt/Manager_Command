"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var client = new pg_1.Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Kasper303',
    database: 'manager_database_db'
});
client.connect()
    .then(function () {
    console.log('Connected to database successfully!');
})
    .catch(function (err) {
    console.error('Error connecting to database', err.stack);
});
module.exports = client;
