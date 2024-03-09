const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp')
const { findRepeatedUser } = require('../utils/functions.js')

const userValidator = [
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
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks']),
  check('statusId')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isInt().withMessage(customMessages['number.int']),
  async (req, res, next) => {
    if(req.repeatedUser) {
      return res.json({ error: true, msg: `Usuario: ${req.body.username} ya existe.`})
    }
    validateRequest(req, res, next)
  }
]


module.exports = {
  userValidator
}

