const Sequelize = require('sequelize');

const conn = new Sequelize('postgres://localhost/sequelize_demo_db');

const Product = conn.define('product', {});
const Category = conn.define('category', {});

conn.sync({ force: true });


