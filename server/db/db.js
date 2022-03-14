const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.DBNAME || 'postgres',process.env.DBCRED || 'postgres',process.env.DBPASS || 'now3ef239vlkn', {
  host:process.env.DBURI || 'localhost',
  dialect:'postgres',
  logging: false
});

module.exports = db;
