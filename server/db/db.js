const Sequelize = require("sequelize");

const db = new Sequelize('postgres','postgres','now3ef239vlkn', {
  host:'192.168.1.68',
  dialect:'postgres',
  logging: false
});

module.exports = db;
