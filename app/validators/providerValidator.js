const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex, emailRegex } = require('../utils/regExp.js')
const { findRepeatedProvider } = require('../utils/functions.js')
const Provider = require('../models/providerModel.js')

const providerValidator = [
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .customSanitizer(async( value, { req }) => {
      await findRepeatedProvider(req, { ruc: req.body.ruc })
      return value
    })
    .custom((value, {req}) => !req.repeatedProvider).withMessage(customMessages['username.repeated']),
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .toUpperCase(),
  check('address')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .toUpperCase(),
  check('telephone')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks']),
  check('email')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => emailRegex.test(value)).withMessage(customMessages['email.invalid']),
  async (req, res, next) => {
    let found = await Provider.findOne({where:{ruc: req.body.ruc}})
    if(found) {
      if(req.params.id) {
        if(parseInt(req.params.id) !== found.id) {
          return res.json({ error: true, msg: `R.U.C: ${req.body.ruc} ya existe.`})
        }
      } else {
        return res.json({ error: true, msg: `R.U.C: ${req.body.ruc} ya existe.`})
      }
    }
    validateRequest(req, res, next)
  }
]


module.exports = {
  providerValidator
}

