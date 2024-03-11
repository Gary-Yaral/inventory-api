const db = require('../database/config')
const Sequelize = require('sequelize')
const Provider = require('./providerModel')

const Invoice = db.define(
  'Invoice',
  {
    code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    providerId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Provider,
        key: 'id'
      }
    },
    observation: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'invoice',
    timestamps: false
  }
)

// Creamos la relación entre proveedores y facturas
Provider.hasMany(Invoice, {foreignKey: 'providerId'})
Invoice.belongsTo(Provider, {foreignKey: 'providerId'})

Invoice.sync()
  .then(() => {
    console.log('Tabla de facturas se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Invoice
