// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');
const favController = require("../controllers/favoritesController");
const { validateFavorite } = require("../utilities/favorite-validation");

// Route to build inventory by classification view
router.get(
  "/login",
  utilities.handleErrors(accController.buildLogin)
);
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
);

// Route to build the registration view
router.get(
  "/register",
  utilities.handleErrors(accController.buildRegister)
);
// post
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
);

// Default account route (account management)
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accController.buildAccountManagement)
);

// access to the update view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accController.buildUpdateAccount)
);
// POST route to process account info update
router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdate,
  utilities.handleErrors(accController.updateAccountInfo)
);
// POST route to process password update
router.post(
  "/update-password",
  regValidate.passwordChangeRules(),
  regValidate.checkPasswordChange,
  utilities.handleErrors(accController.updatePassword)
);
// GET logout
router.get(
  "/logout",
  utilities.handleErrors(accController.logout)
);

// POST Add to favorites 
router.post(
  "/favorites/add",
  utilities.checkLogin,
  validateFavorite,
  utilities.handleErrors(favController.addFavorite)
)
// GET View favorites
router.get(
  "/favorites",
  utilities.checkLogin,
  utilities.handleErrors(favController.viewFavorites)
)
// 
router.get(
  "/favorites/add/:inv_id",
  utilities.handleErrors(accController.addFavorite)
)
module.exports = router;