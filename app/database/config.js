const Sequelize = require('sequelize')

const sequelize = new Sequelize('inventory','root','', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
})

sequelize.authenticate()
  .then(() =>{
    console.log('Logged')
  })

module.exports = sequelize