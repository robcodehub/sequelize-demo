const app = require('express').Router();
const db = require('./db');

app.get('/products', async(req, res, next) => {
  try {
    res.send( await db.models.Product.findAll({ include: [ db.models.Category] }));
  }
  catch(ex) {
    next(ex);
  }

});


app.get('/categories', async(req, res, next) => {
  try {
    res.send( await db.models.Category.findAll({ include: [db.models.Product]}));
  }
  catch(ex) {
    next(ex);
  }

});


module.exports = app;

