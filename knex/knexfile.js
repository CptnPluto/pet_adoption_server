const path = require("path");
require("dotenv").config();

const pathToMigrations = path.resolve(__dirname, "../migrations");

module.exports = {
    client: "mysql",
    connection: {
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWD,
        host: process.env.HOSTNAME,
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: "knex_migrations",
        directory: pathToMigrations,
    },
};
