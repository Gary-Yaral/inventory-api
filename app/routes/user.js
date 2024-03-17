const userController = require('../controllers/userController')
const { userValidator } = require('../validators/userValidator')

const { validateToken } = require('../middlewares/auth')
const User = require('../models/userModel')
const router = require('express').Router()
const { findId } = require('../middlewares/findId') 
router.get('/', validateToken, userController.paginate)
router.post('/filter', validateToken, userController.paginateAndFilter)
router.post('/', validateToken, userValidator, userController.add)
router.get('/find', validateToken, userController.findOne)
router.put('/:id', validateToken, findId(User), userValidator, userController.update)
router.delete('/:id', validateToken, userController.remove)

module.exports = { router}