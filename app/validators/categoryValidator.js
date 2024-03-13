const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')
const Category = require('../models/categoryModel.js')

const categoryValidator = [
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .customSanitizer((value, {req}) => {
      req.body.name = value.toUpperCase()
      return value.toUpperCase()
    }),
  async (req, res, next) => {
    let found = await Category.findOne({where:{name: req.body.name}})
    if(found) {
      if(req.params.id) {
        if(parseInt(req.params.id) !== found.id) {
          return res.json({ error: true, msg: `Categoría: ${req.body.name} ya existe.`})
        }
      } else {
        return res.json({ error: true, msg: `Categoría: ${req.body.name} ya existe.`})
      }
    }
    validateRequest(req, res, next)
  }
]


module.exports = {
  categoryValidator
}

