const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')
const { getErrorFormat } = require('../utils/errorsFormat.js')
const Invoice = require('../models/invoiceModel.js')
const Provider = require('../models/providerModel.js')

const providerInvoice = [
  check('code')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('date')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('providerId')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isNumeric().withMessage(customMessages['number.int']),
  check('observation')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  async (req, res, next) => {
    try {
      // Validamos si está repetido no
      let found = await Invoice.findOne({include: [Provider], where: {providerId: req.body.providerId, code: req.body.code}})
      if(found) {
        if(req.params.id) {
          if(parseInt(req.params.id) !== found.id){
            return res.json({ error: true, msg: `Proveedor ${found.Provider.name} ya ha emitido la factura: ${req.body.code} anteriormente.`})
          }
        } else {
          return res.json({ error: true, msg: `Proveedor ${found.Provider.name} ya ha emitido la factura: ${req.body.code} anteriormente.`})
        }
      }
      validateRequest(req, res, next)
    } catch (error) {
      console.log(error)
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error al buscar el registro', errorName) }
      let errorKeys = [errorName]
      return res.status(400).json({ errors, errorKeys})
    }
  }
]


module.exports = {
  providerInvoice
}

