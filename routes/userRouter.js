const router = require('express').Router();
const userController = require('../controller/userController')
const auth = require('../middleware/verifyToken')





router.post('/register', userController.register ) 
router.post('/verify', userController.verifyRegister) 
router.post('/login', userController.login) 
router.post('/change-Password', userController.changePassword) 



module.exports = router 