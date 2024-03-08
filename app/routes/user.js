const userController = require('../controllers/userController')
const { userValidator } = require('../validators/userValidator')
const { validatorPasswordReset } = require('../validators/passwordValidatorReset')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/', validateToken, userController.paginate)
router.post('/filter', validateToken, userController.paginateAndFilter)
router.put('/password', validatorPasswordReset, userController.resetPassword)
router.post('/', validateToken, userValidator, userController.add)
router.put('/:id/:roleId', validateToken, userValidator, userController.update)
router.delete('/:id', validateToken, userController.remove)

module.exports = { router}