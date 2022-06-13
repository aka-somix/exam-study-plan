/* Data Access Object (DAO) module for accessing users */

const { promisify } = require('util');
const promisifiedScrypt = promisify(require('crypto').scrypt);

const crypto = require('crypto');

const localDB = require('../libs/sqliteLocalDB');

const getUser = async (id) => {
  const database = await localDB.connect();

  const row = await database.get('SELECT * FROM user WHERE username = ?', [id]);
  if (row === undefined) return ({ error: 'User not found.' });
  // else
  const user = { username: row.username, name: row.name };
  return user;
};

const getUserCredentials = async (username, password) => {
  const database = await localDB.connect();

  const row = await database.get('SELECT * FROM user WHERE username = ?', [username]);

  if (row === undefined) return ({ error: 'User not found.' });
  const user = { username: row.username, name: row.name };
  const { salt } = row;

  const hashedPassword = await promisifiedScrypt(password, salt, 32);
  const passwordHex = Buffer.from(row.password, 'hex');

  if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) return ({ error: 'Incorrect Password' });
  return user;
};

module.exports = { getUserCredentials, getUser };
