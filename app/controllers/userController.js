const sequelize = require('../database/config')
const { Op } = require('sequelize')
const Role = require('../models/roleModel')
const User = require('../models/userModel')
const UserStatus = require('../models/userStatusModel')
const { generateHash } = require('../utils/bcrypt')
const { getErrorFormat } = require('../utils/errorsFormat')
const { createToken, OPTIONS_TOKEN } = require('../utils/jwt')
const { ROLES_TYPE } = require('../constants')

async function getAuth(req, res) {
  try {
    // Creamos la data del usuario
    const user = {
      id: req.found.id,
      name: req.found.name,
      lastname: req.found.lastname,
      role: req.found.roleId,
      roleName: req.found.Role.name
    }
    // Creamos el token
    const token = createToken(user, OPTIONS_TOKEN.create)
    // Creamos el refresh token
    const refreshToken = createToken(user, OPTIONS_TOKEN.refresh)
    // eliminamos el id del usuario
    delete user.id
    // Agregamos el token 
    user.token = token
    user.refreshToken = refreshToken
    // Restornamos los datos de la sesión
    return res.json({data: user})
  } catch (error) {
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al validar credenciales', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function refreshtoken(req, res) {
  try {
    // Verificamos si aun existe ese usuario
    const found = await User.findOne({include: [Role, UserStatus], where: {id: req.user.data.id}})
    if(!found) {
      return res.status(401).json({ message: 'Token invalid' })
    } 
    // Creamos la data del usuario
    const user = {
      id: found.id,
      name: found.name,
      lastname: found.lastname,
      role: found.roleId,
      roleName: found.Role.name
    }
    // Creamos el token
    const token = createToken(user, OPTIONS_TOKEN.create)
    const refreshToken = createToken(user, OPTIONS_TOKEN.refresh)
    user.token = token
    user.refreshToken = refreshToken
    // Restornamos los datos de la sesión
    return res.json({data: user})
  } catch (error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al validar credenciales', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function paginate(req, res) {
  try {
    let { id } = req.user.data
    let { perPage, currentPage } = req.query
    let users = await User.findAndCountAll({
      include: [Role, UserStatus],
      attributes: {exclude: ['password']},
      raw: true,
      where: {
        id: { [Op.ne]: id },
        '$Role.id$': {[Op.ne]: ROLES_TYPE.ADMIN}
      },
      limit: parseInt(perPage),
      offset: (parseInt(currentPage) - 1) * parseInt(perPage)
    })
    res.json({
      data: users
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
    let { id } = req.user.data
    let { filter, perPage, currentPage } = req.body
    perPage = parseInt(perPage)
    currentPage = parseInt(currentPage)
    let users = await User.findAndCountAll({
      include: [Role, UserStatus],
      raw: true,
      attributes: {exclude: ['password']},
      where: { 
        id: { [Op.ne]: id},
        '$Role.id$': {[Op.ne]: ROLES_TYPE.ADMIN},     
        [Op.or]: [
          { name: { [Op.like]: `%${filter}%` } },
          { lastname: { [Op.like]: `%${filter}%` } },
          { username: { [Op.like]: `%${filter}%` } },
          { '$Role.name$': { [Op.like]: `%${filter}%` } },
          { '$UserStatus.name$': { [Op.like]: `%${filter}%` } }
        ]
      },
      limit: parseInt(perPage),
      offset: (currentPage - 1) * perPage

    })
    res.json({ data: users })
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
    // Creamos el hash
    req.body.password =  await generateHash(req.body.password)
    await User.create(req.body, {transaction})
    // Guardamos los cambios
    await transaction.commit() 
    return res.json({
      done: true,
      msg: 'Usuario registrado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al crear usuario', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try {
    if(req.body.password) {
      req.body.password =  await generateHash(req.body.password)
    }
    await User.update(req.body, {where: {id: req.found.id}}, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Usuario actualizado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al actualizar usuario', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function resetPassword(req, res) {
  const transaction = await sequelize.transaction()
  try {
    // Creamos el hash
    const password =  await generateHash(req.body.password)
    // Actualizamos la contraseña
    await User.update({password}, {where: {dni: req.body.dni}}, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Usuario actualizado correctamente'
    })
    
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({error})
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    if(!req.params.id){
      return res.json({ error: 'No se ha recibido el id del registro a eliminar' })
    }
    // Buscamos el registro a eliminar
    const userToDelete = await User.findOne({ where: { id: req.params.id }})
    // Si no lo encontramos devolvemos mensaje de error
    if(!userToDelete) {
      return res.json({
        error: false,
        msg: 'Usuario no existe en el sistema'
      })
    }
    // Si existe el usuario entonces lo eliminamos
    await User.destroy({ where: { id: req.params.id }, transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Usuario eliminado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al crear usuario', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function findOne(req, res) {
  try {
    const found = await User.findOne({attributes: {exclude: ['password']}, where: {id: req.user.data.id}})
    return res.json({data: found})
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}


module.exports = {
  add,
  update,
  remove,
  getAuth,
  paginate,
  findOne,
  refreshtoken,
  paginateAndFilter,
  resetPassword
}