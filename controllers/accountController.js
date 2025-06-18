const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver Account Management View
* *************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: "You're logged in"
  })
}

// deliver the update form view
async function buildUpdateAccount(req, res) {
  const nav = await utilities.getNav()
  const accountId = req.params.account_id
  const accountData = await accountModel.getAccountById(accountId)

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  })
}

// update account data
async function updateAccountInfo(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const nav = await utilities.getNav()

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const accountData = {
      account_id,
      account_firstname,
      account_lastname,
      account_email
    }
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData
    })
  }

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
  } else {
    req.flash("notice", "Update failed. Try again.")
  }
  res.redirect("/account")
}

// update password
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const nav = await utilities.getNav()
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
  } else {
    req.flash("notice", "Password update failed.")
  }
  res.redirect("/account")
}

// log out
async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have successfully logged out.")
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  accountLogin,
  buildUpdateAccount,
  updateAccountInfo,
  updatePassword,
  logout
}