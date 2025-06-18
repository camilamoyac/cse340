// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accController.buildLogin));
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
);
// Route to build the registration view
router.get("/register", utilities.handleErrors(accController.buildRegister));
// post
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);
// Default account route (account management)
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement));

module.exports = router;