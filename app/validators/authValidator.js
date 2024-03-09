const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest')
const { customMessages } = require('../utils/customMessages.js')
const User = require('../models/userModel.js')
const { getErrorFormat } = require('../utils/errorsFormat.js')
const Role = require('../models/roleModel.js')
const UserStatus = require('../models/userStatusModel.js')
const { validateHash } = require('../utils/bcrypt.js')
const { USER_STATUS } = require('../constants/index.js')

const authValidator = [
  check('username')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks']),
  check('password')
    .optional()
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks']),
  async (req, res, next) => {
    try {
      // Buscamos el usuario
      let foundUser = await User.findOne({
        include: [ Role, UserStatus], 
        where: { username: req.body.username }
      })
      // si existe validamos sus credenciales
      if(foundUser) {
        const passwordValid = await validateHash(req.body.password, foundUser.password)
        if(!passwordValid) {
          return res.json({error: true, msg: 'Error de usuario o contraseña'})
        }
        // Verificamos si está activo
        if(foundUser.statusId === USER_STATUS.BLOQUEADO) {
          return res.json({error: true, msg: 'Usuario desahilitado. Comuníquese con el administrador'})
        }
        // Eliminamos la constraseña
        delete foundUser.password
        // Guardamos el usuario encontrado para luego procesarlo
        req.found = foundUser
      } else {
        // Si no existe devolvemos un error
        return res.json({error: true, msg: 'Error de usuario o contraseña'})
      }
    } catch (err) {
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error al buscar el registro', errorName) }
      let errorKeys = [errorName]
      return res.status(400).json({ errors, errorKeys})
    }
    // Si existe el usuario buscamos los datos actuales del rol de usuario
    validateRequest(req, res, next)
  }
]


module.exports = {
  authValidator
}

