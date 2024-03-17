const sequelize = require('../database/config')
const { Op } = require('sequelize')

const { getErrorFormat } = require('../utils/errorsFormat')
const Provider = require('../models/providerModel')

async function getAll(req, res) {
  try {
    let providers = await Provider.findAll()
    res.json({
      data: providers
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function count(req, res) {
  try {
    let providers = await Provider.count()
    res.json({
      data: { 
        section: 'Proveedores',
        rows: providers 
      }
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}


async function paginate(req, res) {
  try {
    let { perPage, currentPage } = req.query
    let providers = await Provider.findAndCountAll({
      limit: parseInt(perPage),
      offset: (parseInt(currentPage) - 1) * parseInt(perPage)
    })
    res.json({
      data: providers
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function paginateAndFilter(req, res) {
  try {
    let { filter, perPage, currentPage } = req.body
    perPage = parseInt(perPage)
    currentPage = parseInt(currentPage)
    let providers = await Provider.findAndCountAll({
      where: { 
        [Op.or]: [
          { ruc: { [Op.like]: `%${filter}%` } },
          { name: { [Op.like]: `%${filter}%` } },
          { telephone: { [Op.like]: `%${filter}%` } },
          { address: { [Op.like]: `%${filter}%` } },
          { email: { [Op.like]: `%${filter}%` } }
        ]
      },
      limit: perPage,
      offset: (currentPage - 1) * perPage

    })
    res.json({ data: providers })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}


async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Provider.create(req.body, {transaction})
    // Guardamos los cambios
    await transaction.commit() 
    return res.json({
      done: true,
      msg: 'Proveedor registrado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al crear proveedor', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Provider.update(req.body, {where: {id: req.found.id}}, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Proveedor actualizado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al actualizar proveedor', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Provider.destroy({ where: { id: req.params.id }, transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Proveedor eliminado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    if(error.parent && error.parent.errno === 1451) {
      return res.json({
        error: true,
        msg: 'No es posible eliminar proveedor, porque hay facturas guardadas y vinculadas a este proveedor'
      })
    }
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al eliminar proveedor', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}


module.exports = {
  add,
  update,
  remove,
  paginate,
  getAll,
  count,
  paginateAndFilter
}