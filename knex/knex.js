const knex = require("knex");
const knexConfig = require("./knexfile");
const dbConnection = knex(knexConfig);

module.exports = dbConnection;

// Useful for : querys, connection, migrations
