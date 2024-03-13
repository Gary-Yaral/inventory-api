const inventoryController = require('../controllers/inventoryController')
const { validateToken } = require('../middlewares/auth')
const { findId } = require('../middlewares/findId')
const Provider = require('../models/providerModel')
const router = require('express').Router()
router.get('/invoices/:id', validateToken, findId(Provider), inventoryController.findInvoices)

module.exports = { router }