const sequelize = require('../database/config')
const { Op } = require('sequelize')
const { getErrorFormat } = require('../utils/errorsFormat')
const Provider = require('../models/providerModel')
const Invoice = require('../models/invoiceModel')
const Inventory = require('../models/InventoryModel')
const { deleteImagesGroup } = require('../utils/deleteFile')
const Image = require('../models/imageModel')
const DamagedImage = require('../models/damagedImageModel')
const Category = require('../models/categoryModel')

async function findInvoices(req, res) {
  try {
    let { id } = req.params
    let invoices = await Invoice.findAll({where: {providerId: id}})
    res.json({
      data: invoices
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function getAll(req, res) {
  try {
    let invoices = await Invoice.findAll()
    res.json({
      data: invoices
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
    let invoices = await Inventory.findAndCountAll({
      include: [ 
        {
          model: Invoice,
          attributes:['id', 'code'],
          include: [{ model: Provider, attributes: ['id', 'name'] }]
        }, 
        Category
      ],
      raw: true,
      limit: parseInt(perPage),
      offset: (parseInt(currentPage) - 1) * parseInt(perPage)
    })
    res.json({
      data: invoices
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
    let inventors = await Inventory.findAndCountAll({
      include: [ 
        {
          model: Invoice,
          attributes:['id', 'code'],
          include: [{ model: Provider, attributes: ['id', 'name'] }]
        }, 
        Category
      ],
      raw: true,
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      where: { 
        [Op.or]: [
          { name: { [Op.like]: `%${filter}%` } },
          { price: { [Op.like]: `%${filter}%` } },
          { quantity: { [Op.eq]: filter } },
          { damaged: { [Op.eq]: filter } },
          { description: { [Op.like]: `%${filter}%` } },
          { '$Invoice.code$': { [Op.like]: `%${filter}%` } },
          { '$Invoice.Provider.name$': { [Op.like]: `%${filter}%` } },
          { '$Category.name$': { [Op.like]: `%${filter}%` } }
        ]
      }
    })
    res.json({ data: inventors })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

function imagesWereDeleted(req) {
  if(req.files.images) {
    if(Array.isArray(req.files.images)) {
      if(!deleteImagesGroup(req.files.images)){
        return {
          error: true,
          msg: `Error al procesar el item: ${req.body.name}, proceso falló y las imagenes no pudieron no pudieron ser eliminadas`
        }
      }
    }
  }
  if(req.files.imgDamaged) {
    if(Array.isArray(req.files.imgDamaged)) {
      if(!deleteImagesGroup(req.files.imgDamaged)){
        return {
          error: true,
          msg: `Error al procesar el item: ${req.body.name}. proceso falló y las imagenes de daños no pudieron no pudieron ser eliminadas`
        }
      }
    }
  }
}

async function saveImagesInDB(req, inventoryId, transaction) {
  if(req.files.images) {
    if(Array.isArray(req.files.images)) {
      // IMAGENES DEL ITEM
      for(let img of req.files.images) {
        if(!(await Image.create({name: img.filename, inventoryId}, {transaction}))) {
          transaction.rollback()
          return {
            error: true,
            msg: `Item ${req.body.name} no se guardó. Error al guardar path de imagenes de item`
          } 
        }
      }
    }
  }
  if(req.files.imgDamaged) {
    if(Array.isArray(req.files.imgDamaged)) {
      // IMAGENES DE LOS DAÑOS
      for(let img of req.files.imgDamaged) {
        if(!(await DamagedImage.create({name: img.filename, inventoryId}, {transaction}))) {
          transaction.rollback()
          return {
            error: true,
            msg: `Item ${req.body.name} no se guardó. Error al guardar path de imagenes de daños`
          } 
        }
      }
    }
  }
}

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    // Eliminamos las propiedades que generan la imagenes
    delete req.body.image
    // Guardamos los datos del item
    const created = await Inventory.create(req.body, {transaction})
    // Si no se cró entonces eliminamos las imagenes que se guardaron y retornamos error
    if(!created) {
      transaction.rollback()
      const hasBeenError = imagesWereDeleted(req)
      if(hasBeenError) {
        return res.json(hasBeenError) 
      } else {
        return res.json({
          error: true,
          msg: `Item: ${req.body.name} no se guardó`
        })
      }
    } 
    // Intentamos guardar la imagenes
    let hasBeenErrorToSave = await saveImagesInDB(req, created.id, transaction)
    // Si retornar algo es porque hay error y lo retornamos en la respuesta de la peticion
    if(hasBeenErrorToSave) {
      return res.json(hasBeenErrorToSave)
    }
    // Si todo ha ido bien guardamso los cambios en la BD
    transaction.commit()
    return res.json({
      done: true,
      msg: `Item ${req.body.name} fue guardado correctamente`
    })
    
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let hasBeenError = imagesWereDeleted(req)
    if(hasBeenError) { return res.json(hasBeenError)}
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, `Item ${req.body.name} no se guardó`, errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Invoice.update(req.body, {where: {id: req.found.id}}, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Factura actualizado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al actualizar factura', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    req.files = {
      images: (await Image.findAll({where: {inventoryId: req.params.id}})).map((img) => {return {filename: img.name}}),
      imgDamaged: (await DamagedImage.findAll({where: {inventoryId: req.params.id}})).map((img) => {return {filename: img.name}})
    }
    await Inventory.destroy({ where: { id: req.params.id }, transaction})
    // eliminamos las imagenes
    const hasErrorToDeleteImg = imagesWereDeleted(req)
    if(hasErrorToDeleteImg) {
      transaction.rollback()
      return res.json(hasErrorToDeleteImg) 
    } 
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: `El Item ${req.found.name} ha sido eliminado correctamente`
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al eliminar item del inventario', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function getImages(req, res) {
  try {
    const data = {
      images: (await Image.findAll({where: {inventoryId: req.params.id}})).map((img) => img.name),
      imgDamaged: (await DamagedImage.findAll({where: {inventoryId: req.params.id}})).map((img) => img.name)
    }
    return res.json({ data })
  } catch (error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar las imagenes del item del inventario', errorName) }
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
  getImages,
  findInvoices,
  paginateAndFilter
}