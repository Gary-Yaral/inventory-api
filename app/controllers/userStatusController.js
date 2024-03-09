const UserStatus = require('../models/userStatusModel')
const { getErrorFormat } = require('../utils/errorsFormat')

async function getAll(req, res) {
  try {
    const data = await UserStatus.findAll()
    return res.json({ data })
  } catch (error) { 
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar statuses', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

module.exports = {
  getAll
}