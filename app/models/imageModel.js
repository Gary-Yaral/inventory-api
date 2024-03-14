const db = require('../database/config')
const Sequelize = require('sequelize')
const Inventory = require('./InventoryModel')

const Image = db.define(
  'Image',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    inventoryId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Inventory,
        key: 'id'
      }
    },
  },
  { 
    tableName: 'images',
    timestamps: false
  } 
)

// Creamos la relacion con el inventario
Inventory.hasMany(Image, {foreignKey: 'inventoryId'})
Image.belongsTo(Inventory, {foreignKey: 'inventoryId'})

Image.sync()
  .then(() => {
    console.log('Tabla de imagenes se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Image
