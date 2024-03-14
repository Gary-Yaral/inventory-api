const db = require('../database/config')
const Sequelize = require('sequelize')
const Inventory = require('./InventoryModel')

const DamagedImage = db.define(
  'DamagedImage',
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
    tableName: 'damaged_images',
    timestamps: false
  } 
)

// Creamos la relacion con el inventario
Inventory.hasMany(DamagedImage, {foreignKey: 'inventoryId'})
DamagedImage.belongsTo(Inventory, {foreignKey: 'inventoryId'})

DamagedImage.sync()
  .then(() => {
    console.log('Tabla de imagenes de daños se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = DamagedImage
