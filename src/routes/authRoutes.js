const express           = require('express');
const authController    = require('../controller/authController');
//const authValidation    = require('../middleware/authValidation');

const router            = express.Router(); 

//register
router.post('/registrar-usuario',authController.register);
//authenticate
router.post('/autenticar-usuario',authController.authenticate);
//forgot password
router.post('/esqueci-senha',authController.forgotPassword);
//reset password
router.post('/resetar-senha',authController.resetPassword);



module.exports = router;
