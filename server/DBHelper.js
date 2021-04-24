const mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud'
});

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE username=? AND password=?", [username, password], (error, results) => {
      if (error) { return reject(error.message) }
      else {
        if (results.length > 0) {
          return resolve(results[0]);
        } else {
          return resolve(null);
        }
      }
    });
  });
}

const register = (username, password) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO users(username, password) VALUES(?, ?)", [username, password], (error, results) => {
      if (error) { return reject(error.message) }
      else {
        return resolve(true);
      }
    });
  });
}

const insertProducts = (title, details, photo) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO products(title, details, photo_name) VALUES(?,?,?)", [title, details, photo], (error, results) => {
      if (error) { return reject(error.message) }
      else {
        return resolve(true);
      }
    });
  });
}

const updateProduct = (id, title, details) => {
  return new Promise((resolve, reject) => {
    pool.query("UPDATE products SET title=?, details=? WHERE id=?", [title, details, id], (error, results) => {
      if (error) { return reject(error.message) }
      else {
        return resolve(true);
      }
    });
  });
}

const getProducts = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM products", (error, results) => {
      if (error) { return reject(error.message) }
      else {
        if (results.length > 0) {
          return resolve(results);
        } else {
          return resolve(null);
        }
      }
    });
  });
}
const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM products WHERE id=?", [id], (error, results) => {
      if (error) { return reject(error.message) }
      else {
        if (results.length > 0) {
          return resolve(results[0]);
        } else {
          return resolve(null);
        }
      }
    });
  });
}

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM products WHERE id=?", [id], (error, results) => {
      if (error) { return reject(error.message) }
      else {
        return resolve(true);
      }
    });
  });
}

module.exports.login = login;
module.exports.register = register;

module.exports.insertProducts = insertProducts;
module.exports.updateProduct = updateProduct;
module.exports.getProducts = getProducts;
module.exports.getProductById = getProductById;
module.exports.deleteProduct = deleteProduct;