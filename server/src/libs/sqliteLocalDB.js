const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

/**
 *  Database Library Wrapper
 */
let database;

const connect = async () => {
  if (database) return database;

  // open the database connection
  database = await open({
    filename: path.join(__dirname, '..', 'data', 'study-plan.db'),
    driver: sqlite3.Database,
  });

  return database;
};

module.exports = {
  connect,
};
