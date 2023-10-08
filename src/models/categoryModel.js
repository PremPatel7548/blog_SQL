const db = require('../database/connection');

const Item = {};

Item.getAll = (callback) => {
  db.query('SELECT * FROM Categorys', callback);
};

Item.create = (item, callback) => {
  db.query('INSERT INTO Categorys SET ?', item, callback);
};

Item.update = (id, item, callback) => {
  db.query('UPDATE Categorys SET ? WHERE categoryID = ?', [item, id], callback);
};

Item.delete = (id, callback) => {   
  db.query('DELETE FROM Categorys WHERE categoryID = ?', [id], callback);
};

module.exports = Item;