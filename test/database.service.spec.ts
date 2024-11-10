// warning: nukes database and resets it, use only during development

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

client.connect()
.then(() => {
    console.log('Connected to the database');
    
    // Read the SQL file
    const filePath = path.join('src/database', 'database_schema.sql');
    const createTablesQuery = fs.readFileSync(filePath, 'utf8');

    return client.query(`DROP TABLE IF EXISTS user_vectors`);
})
.then(() => {
    console.log('Tables created successfully');
})
.catch(err => {
    console.error('Error executing query', err.stack);
})
.finally(() => {
    client.end();
});