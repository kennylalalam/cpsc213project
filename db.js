const pgp = require('pg-promise')();

// This module exports a function that takes a
// database url and returns a Postgres connection.
// See https://github.com/vitaly-t/pg-promise
module.exports = databaseURL => pgp(databaseURL);
