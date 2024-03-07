const db = require('../database/config')
const Sequelize = require('sequelize')

const Role = db.define(
  'Role',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  { 
    tableName: 'role',
    timestamps: false
  } 
)

Role.sync()
  .then(() => {
    console.log('Tabla roles se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Role
