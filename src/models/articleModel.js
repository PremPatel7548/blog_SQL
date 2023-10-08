const db = require('../database/connection');

const Item = {};

Item.getAll = (callback) => {
  db.query('SELECT * FROM Articles', callback);
};

Item.create = (item, callback) => {
  db.query('INSERT INTO Articles SET ?', item, callback);
};

Item.update = (id, item, callback) => {
  db.query('UPDATE Articles SET ? WHERE articleID = ?', [item, id], callback);
};

Item.delete = (id, callback) => {   
  db.query('DELETE FROM Articles WHERE articleID = ?', [id], callback);
};

module.exports = Item;