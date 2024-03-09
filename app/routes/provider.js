
const providerController = require('../controllers/providerController')
const { validateToken } = require('../middlewares/auth')
const { findId } = require('../middlewares/findId')
const Provider = require('../models/providerModel')
const { providerValidator } = require('../validators/providerValidator')
const router = require('express').Router() 
router.get('/', validateToken, providerController.paginate)
router.post('/filter', validateToken, providerController.paginateAndFilter)
router.post('/', validateToken, providerValidator , providerController.add)
router.put('/:id', validateToken, findId(Provider), providerValidator , providerController.update)
router.delete('/:id', validateToken, findId(Provider), providerController.remove)

module.exports = { router }