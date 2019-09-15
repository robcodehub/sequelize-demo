const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/sequelize_demo_db');

const Product = conn.define('product', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  inStock: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

Product.inStockProducts = function() {
  return this.findAll( { where: { inStock: true }});
}

Product.prototype.findSimilar = function() {
  return Product.findAll({where: { categoryId: this.categoryId }})
  .then (products => products.filter(product=> product.id !== this.id));
};

Product.prototype.sayHi = function() {
  return `Hello, my id is ${this.id} and my name is ${this.name} and I am ${this.inStock ? 'in stock': 'Out of stock'}`
}


const Category = conn.define('category', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

Product.belongsTo(Category)
Category.hasMany(Product)

const syncAndSeed = async () => {

  await conn.sync({ force: true });
  const [fooCategory, barCategory, bazzCategory] = await Promise.all([
  Category.create({name: 'The Foo Category'}),
  Category.create({name: 'The Bar Category'}),
  Category.create({name: 'The Bazz Category'})
  ]);
  const [foo1, foo2, foo3, bar1] = await Promise.all([
    Product.create({name: 'Foo 1', categoryId: fooCategory.id}),
    Product.create({name: 'Foo 2', categoryId: fooCategory.id}),
    Product.create({name: 'Foo 3', categoryId: fooCategory.id}),
    Product.create({name: 'Bar 1', categoryId: barCategory.id}),
    Product.create({name: 'Quq 1', inStock: false}),
    ]);

    const similar = await foo1.findSimilar();
    const names = similar.map(item => item.name);
    console.log(names);

};

module.exports = {
syncAndSeed,
models: {
  Product,
  Category
}
}

