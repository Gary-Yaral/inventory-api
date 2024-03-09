const db = require('../database/config')
const Sequelize = require('sequelize')

const Provider = db.define(
  'Provider',
  {
    ruc: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    telephone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  { 
    tableName: 'provider',
    timestamps: false
  }
)
Provider.sync()
  .then(() => {
    console.log('Tabla de proveedores se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Provider
