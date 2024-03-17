
const categoryController = require('../controllers/categoryController')
const { validateToken } = require('../middlewares/auth')
const { findId } = require('../middlewares/findId')
const Category = require('../models/categoryModel')
const { categoryValidator } = require('../validators/categoryValidator')
const router = require('express').Router() 

router.get('/', validateToken, categoryController.paginate)
router.get('/all', validateToken, categoryController.getAll)
router.post('/filter', validateToken, categoryController.paginateAndFilter)
router.post('/count', validateToken, categoryController.count)
router.post('/', validateToken, categoryValidator , categoryController.add)
router.put('/:id', validateToken, findId(Category), categoryValidator , categoryController.update)
router.delete('/:id', validateToken, findId(Category), categoryController.remove)

module.exports = { router }