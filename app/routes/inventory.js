const inventoryController = require('../controllers/inventoryController')
const { validateToken } = require('../middlewares/auth')
const { findId } = require('../middlewares/findId')
const Provider = require('../models/providerModel')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/uploads/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('IMG', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })
router.get('/invoices/:id', validateToken, findId(Provider), inventoryController.findInvoices)
router.post('/', validateToken, upload.fields([{ name: 'images' }, { name: 'imgDamaged' }]), inventoryController.add)

module.exports = { router }