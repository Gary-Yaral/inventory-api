const db = require('../database/config')
const Sequelize = require('sequelize')
const Role = require('./roleModel')
const UserStatus = require('./userStatusModel')

const User = db.define(
  'User',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id'
      }
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserStatus,
        key: 'id'
      }
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING, 
    },
  },
  { 
    tableName: 'user',
    timestamps: false
  }
)

// Añadimos las relaciones entre las tablas
Role.hasMany(User, {foreignKey: 'roleId'})
User.belongsTo(Role, {foreignKey: 'roleId'})

UserStatus.hasMany(User, {foreignKey: 'statusId'})
User.belongsTo(UserStatus, {foreignKey: 'statusId'})

User.sync()
  .then(() => {
    console.log('Tabla de usuarios se ha sincronizado')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = User
