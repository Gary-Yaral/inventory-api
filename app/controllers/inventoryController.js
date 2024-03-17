const sequelize = require('../database/config')
const { Op, literal } = require('sequelize')
const { getErrorFormat } = require('../utils/errorsFormat')
const Provider = require('../models/providerModel')
const Invoice = require('../models/invoiceModel')
const Inventory = require('../models/InventoryModel')
const { deleteImagesGroup } = require('../utils/deleteFile')
const Image = require('../models/imageModel')
const DamagedImage = require('../models/damagedImageModel')
const Category = require('../models/categoryModel')
const { isUniqueNotEmpty, areUniquesNotEmpty } = require('../utils/functions')

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

async function count(req, res) {
  try {
    let inventory = await Inventory.count()
    res.json({
      data: { 
        section: 'Items',
        rows: inventory 
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

async function getByFilterReport(req, res) {
  try {
    let {providerId, invoiceId, categoryId, date} = req.body
    // Validamos que solos haya enviado una propiedad llena
    if(isUniqueNotEmpty(req.body, 'providerId')) {
      const items = await filterBy({
        '$Invoice.Provider.id$': providerId
      })
      return res.json({
        data: items,
      })
    }

    if(isUniqueNotEmpty(req.body, 'categoryId')) {
      const items = await filterBy({
        '$Category.id$': categoryId
      })
      return res.json({
        data: items,
      })
    }
    if(isUniqueNotEmpty(req.body, 'date')) {
      const items = await filterBy({
        '$Invoice.date$': date
      })
      return res.json({
        data: items,
      })
    }

    // Validamos si hay enviado solo dos campos llenos 
    if(areUniquesNotEmpty(req.body, ['providerId', 'invoiceId'])) {
      const items = await filterBy({
        '$Invoice.Provider.id$': providerId,
        '$Invoice.id$': invoiceId,
      })
      return res.json({
        data: items,
      })
    }

    if(areUniquesNotEmpty(req.body, ['providerId', 'categoryId'])) {
      const items = await filterBy({
        '$Invoice.Provider.id$': providerId,
        '$Category.id$': categoryId,
      })
      return res.json({
        data: items
      })
    }
 
    if(areUniquesNotEmpty(req.body, ['providerId', 'date'])) {
      const items = await filterBy({
        '$Invoice.Provider.id$': providerId,
        '$Invoice.date$': date,
      })
      return res.json({
        data: items
      })
    }

    if(areUniquesNotEmpty(req.body, ['categoryId', 'date'])) {
      const items = await filterBy({
        '$Category.id$': categoryId,
        '$Invoice.date$': date,
      })
      return res.json({
        data: items
      })
    }

    // Validamos si envio solo tres campos llenos
    if(areUniquesNotEmpty(req.body, ['providerId', 'invoiceId', 'categoryId'])) {
      const items = await filterBy({
        '$Invoice.id$': invoiceId,
        '$Category.id$': categoryId,
      })
      return res.json({
        data: items
      })
    }
    if(areUniquesNotEmpty(req.body, ['providerId', 'invoiceId', 'date'])) {
      const items = await filterBy({
        '$Invoice.id$': invoiceId
      })
      return res.json({
        data: items
      })
    }

    // Envió los 4 campos llenos 
    if(areUniquesNotEmpty(req.body, ['providerId', 'invoiceId', 'categoryId', 'date',])) {
      const items = await filterBy({
        '$Invoice.id$': invoiceId,
        '$Category.id$': categoryId,
      })
      return res.json({
        data: items
      })
    }
    // DEvolverá todos los items registrados
    return res.json({
      data: await Inventory.findAndCountAll()
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys})
  }
}

async function filterBy(where) {
  return await Inventory.findAndCountAll({
    include: [
      {
        model: Invoice,
        include: [ Provider ]
      }, Category
    ],
    raw: true,
    where
  })
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
    let where = {
      [Op.or]: [
        { name: { [Op.like]: '%' + filter + '%' } },
        { description: { [Op.like]: '%' + filter + '%' } },
        { '$Invoice.code$': { [Op.like]: '%' + filter + '%' } },
        { '$Invoice.Provider.name$': { [Op.like]: '%' + filter + '%' } },
        { '$Category.name$': { [Op.like]: '%' + filter + '%' } },
        literal(`CAST(price AS CHAR) LIKE '%${filter}%'`),
        literal(`CAST(damaged AS CHAR) LIKE '%${filter}%'`),
        literal(`CAST(quantity AS CHAR) LIKE '%${filter}%'`)
        
      ]      
    }
    let inventors = await Inventory.findAndCountAll({
      include: [ 
        {
          model: Invoice,
          include: [Provider]
        }, 
        Category
      ],
      raw: true,
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      where
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
            msg: `Error en item ${req.body.name}. Error al guardar path de imagenes de item`
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
            msg: `Error en item ${req.body.name}. Error al guardar path de imagenes de daños`
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
    await Inventory.update(req.body, {where: {id: req.found.id}}, {transaction})
    // Verificamos si envio imagenes nuevas del item
    if((!req.files || Object.keys(req.files).length === 0) && parseInt(req.body.damaged) > 0) {
      // Si todo ha ido bien guardamos los cambios
      await transaction.commit()
      return res.json({
        done: true,
        msg: 'Item actualizado correctamente'
      })
    }
    // Obtenemos todas las imagenes que este item tenga previamente guardadas
    let allImages = {
      files: {
        images: (await Image.findAll({where: {inventoryId: req.params.id}})).map((img) => ({filename: img.name})),
        imgDamaged: (await DamagedImage.findAll({where: {inventoryId: req.params.id}})).map((img) => ({filename: img.name}))
      }
    }
    // Varificamos si nos estan enviando imagenes nuevas para actualizar
    if(req.files.images) {
      if(req.files.images.length > 0) {
        // Verificamos si este item ya tiene imagenes guardadas previamente
        if(allImages.files.images.length > 0) {
          // Eliminamos las imagenes que haya guardado previamente en la BD
          await Image.destroy({where: {inventoryId: req.params.id}},{transaction})
          // Eliminamos las imagenes de la carpeta upload
          let hasBeenError = imagesWereDeleted({files: {images: allImages.files.images}})
          /// Verificamos si hay error al eliminar los archivos de las imagenes
          if(hasBeenError) {
            transaction.rollback()
            return res.json(hasBeenError)
          }
        }
        // Creamos un arreglo copia
        let images = []
        // Procesamos la informacion de las imagenes para tener formato deseado
        req.files.images.forEach((img) => (images.push({name: img.filename, inventoryId: req.params.id})))
        // Guardo las nuevas imagenes
        await Image.bulkCreate(images)
      }
    }

    // Varificamos si nos estan enviando imagenes nuevas para actualizar
    if(req.files.imgDamaged) {
      if(req.files.imgDamaged.length > 0) {
        // Verificamos si este item ya tiene imagenes guardadas previamente
        if(allImages.files.imgDamaged.length > 0) {
          // Eliminamos las imagenes que haya guardado previamente en la BD
          await DamagedImage.destroy({where: {inventoryId: req.params.id}},{transaction})
          // Eliminamos las imagenes de la carpeta upload
          let hasBeenError = imagesWereDeleted({files: {imgDamaged: allImages.files.imgDamaged}})
          /// Verificamos si hay error al eliminar los archivos de las imagenes
          if(hasBeenError) {
            transaction.rollback()
            return res.json(hasBeenError)
          }
        }
        // Creamos un arreglo copia
        let images = []
        // Procesamos la informacion de las imagenes para tener formato deseado
        req.files.imgDamaged.forEach((img) => (images.push({name: img.filename, inventoryId: req.params.id})))
        // Guardo las nuevas imagenes
        await DamagedImage.bulkCreate(images)
      }
    }
    // Si quitó los daños entonces eliminamos todas la imagenes
    if(parseInt(req.body.damaged) === 0) {
      // Verificamos si este item ya tiene imagenes guardadas previamente
      if(allImages.files.imgDamaged.length > 0) {
        // Eliminamos las imagenes que haya guardado previamente en la BD
        await DamagedImage.destroy({where: {inventoryId: req.params.id}},{transaction})
        // Eliminamos las imagenes de la carpeta upload
        let hasBeenError = imagesWereDeleted({files: {imgDamaged: allImages.files.imgDamaged}})
        /// Verificamos si hay error al eliminar los archivos de las imagenes
        if(hasBeenError) {
          transaction.rollback()
          return res.json(hasBeenError)
        }
      }
    }
    await transaction.commit( )
    return res.json({
      done: true,
      msg: 'Item actualizado correctamente'
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
      inventory: (await Inventory.findOne({
        where:{id: req.params.id},
        include:[{
          model: Invoice, 
          attributes: ['code'],
          include: [{
            model:Provider,
            attributes: ['name']
          }]
        }, {
          model: Category,
          attributes: ['name']
        }],
        raw: true
      })),
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
  count,
  getByFilterReport,
  getImages,
  findInvoices,
  paginateAndFilter
}