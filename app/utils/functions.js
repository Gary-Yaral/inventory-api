const User = require('../models/userModel')

async function findRepeatedUser(req, data) {
  const user = await User.findOne({ 
    attributes: { exclude: ['password'] }, 
    where: data, 
    raw:true 
  })
  if(user) {
    // Verificamos si está intentando actualizar
    if(req.params.id) {
      // Si alguien mas tiene esa cedula entonces lo añadimos a los repetidos
      if(parseInt(user.id) !== parseInt(req.params.id)) {
        req.repeatedUser = true
      }
    } else {
      // Si alguien mas tiene esa cedula entonces lo añadimos a los repetidos
      req.repeatedUser = true
    }
  }
}

module.exports = { findRepeatedUser }