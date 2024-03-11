const { getErrorFormat } = require('../utils/errorsFormat')

function findId(model) {
  return async function(req, res, next){
    try {
      if(!req.params.id) {
        return res.json({ error: true, msg: 'No se ha recibido el parametro id' })
      }
      const found = await model.findByPk(req.params.id)
      if(!found) {
        return res.json({ error: true, msg: 'No existe el registro con ese id' })
      }
      req.found = found
      next()
    } catch (error) {
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error en la petición', errorName)}
      let errorKeys = [errorName]
      res.status(400).json({ errors, errorKeys })
    }
  }
}



module.exports = { findId }