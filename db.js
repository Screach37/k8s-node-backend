// config/db.js
// src/config/knexfile.js

require('dotenv').config();


var knexConfig= {
    development: {
      client: 'mysql',
      connection: {
        host:process.env.db_hostname,
        user:process.env.db_user,
        password:process.env.db_password,
        database:process.env.db_name,
      },
      migrations: {
        directory: './migrations'
      },
    },
  };
  








const Knex = require('knex');

const { Model } = require('objection');
// console.log(process.env.db_hostname)
// console.log(process.env.db_user)
// console.log(process.env.db_password)
// console.log(process.env.db_name)

// Initialize Knex
const knex = Knex(knexConfig.development);

// Attach the Knex instance to the Objection.js Model
Model.knex(knex);

module.exports = knex;
