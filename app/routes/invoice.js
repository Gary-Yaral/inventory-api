const invoiceController = require('../controllers/invoiceController')
const { validateToken } = require('../middlewares/auth')
const { findId } = require('../middlewares/findId')
const Invoice = require('../models/invoiceModel')
const { providerInvoice } = require('../validators/invoiceValidator')
const router = require('express').Router() 
router.get('/', validateToken, invoiceController.paginate)
router.get('/all', validateToken, invoiceController.getAll)
router.post('/filter', validateToken, invoiceController.paginateAndFilter)
router.post('/', validateToken, providerInvoice , invoiceController.add)
router.put('/:id', validateToken, findId(Invoice), providerInvoice , invoiceController.update)
router.delete('/:id', validateToken, findId(Invoice), invoiceController.remove)

module.exports = { router }