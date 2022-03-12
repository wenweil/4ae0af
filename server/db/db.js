const Sequelize = require("sequelize");

const db = new Sequelize('postgres','postgres','now3ef239vlkn', {
  host:'localhost',
  dialect:'postgres',
  logging: false
});

module.exports = db;
