const db = require('../database/config')
const Sequelize = require('sequelize')
const Invoice = require('./invoiceModel')
const Category = require('./categoryModel')

const Inventory = db.define(
  'Inventory',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    quantity: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    damaged: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    invoiceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Invoice,
        key: 'id'
      }
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id'
      }
    }
  },
  { 
    tableName: 'inventory',
    timestamps: false
  }
)

// Añadimos las relaciones entre las tablas
Invoice.hasMany(Inventory, {foreignKey: 'invoiceId'})
Inventory.belongsTo(Invoice, {foreignKey: 'invoiceId'})

Category.hasMany(Inventory, {foreignKey: 'categoryId'})
Inventory.belongsTo(Category, {foreignKey: 'categoryId'})

Inventory.sync()
  .then(() => {
    console.log('Tabla de inventario se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Inventory
