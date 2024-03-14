require('dotenv').config()
const express = require('express')
const sequelize = require('./app/database/config')
const routes = require('./app/routes/index')
const path = require('path')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 4000 

app.use(cors({
  origin: '*'
}))
app.use(express.json())
app.use('/api/uploads', express.static(path.join(__dirname, 'app' ,'uploads')))
app.use('/api', routes.router)
app.get('/', (req, res) => {
  return res.json({message: 'Hello world'})
})
// Middleware para servir archivos estáticos desde la carpeta 'imagenes'

sequelize.sync()
  .then(() => {
    app.listen(PORT)
    console.log('La base de datos se ha sincronizado')
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
