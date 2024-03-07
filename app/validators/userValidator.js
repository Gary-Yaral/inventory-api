const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex, hardTextRegex} = require('../utils/regExp')
const { findRepeatedUser } = require('../utils/functions.js')
const User = require('../models/userModel.js')
const { getErrorFormat } = require('../utils/errorsFormat.js')
const Role = require('../models/roleModel.js')
const UserStatus = require('../models/userStatusModel.js')

const validatorUser = [
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .toUpperCase(),
  check('lastname')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .toUpperCase(),
  check('username')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .customSanitizer(async( value, { req }) => {
      await findRepeatedUser(req, { username: req.body.username })
      return value
    })
    .custom((value, {req}) => !req.repeatedUser).withMessage(customMessages['username.repeated']),
  check('password')
    .optional()
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => hardTextRegex.test(value)).withMessage(customMessages['hardText.invalid']),
  check('statusId')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isInt().withMessage(customMessages['number.int']),
  async (req, res, next) => {
    try {
      let foundUser = await User.findOne({
        include: [Role, UserStatus],
        where: {
          username: req.body.username}
      })
      console.log(foundUser)
      if(foundUser) {
        req.found = foundUser
      } else {
        let errorName = 'request'
        let errors = {...getErrorFormat(errorName, 'Error de usuario o contraseña', errorName) }
        let errorKeys = [errorName]
        return res.status(400).json({ errors, errorKeys})
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
  validatorUser
}

