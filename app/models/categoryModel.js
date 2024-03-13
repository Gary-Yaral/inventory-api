const db = require('../database/config')
const Sequelize = require('sequelize')

const Category = db.define(
  'Category',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'category',
    timestamps: false
  }
)
Category.sync()
  .then(() => {
    console.log('Tabla de categorias se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Category
