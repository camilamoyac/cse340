// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accController.buildLogin));
// Route to build the registration view
router.get("/register", utilities.handleErrors(accController.buildRegister));
// post
router.post('/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);

module.exports = router;