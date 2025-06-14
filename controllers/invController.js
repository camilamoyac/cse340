const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav
    })
  } catch (error) {
    next(error)
  }
}

/* Show add-classification form */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* Handle classification form submission */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  try {
    const addResult = await invModel.addClassification(classification_name)
    if (addResult) {
      const nav = await utilities.getNav()
      res.locals.nav = nav
      req.flash("message", "New classification added successfully.")
      res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("message")
      })
    } else {
      req.flash("message", "Failed to add classification.")
      const nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        message: req.flash("message"),
        errors: null
      })
    }
  } catch (error) {
    throw new Error("Database error: " + error.message)
  }
}

module.exports = invCont