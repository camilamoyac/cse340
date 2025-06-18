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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
    message: req.flash("message")
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

// Build Add inventory form
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null
  })
}

// Handle inventory form submission
invCont.addInventory = async function (req, res) {
  const {
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year,
    inv_miles, inv_color
  } = req.body

  try {
    const result = await invModel.addInventoryItem(
      classification_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year,
      inv_miles, inv_color
    )
    console.log("Inventory insert result:", result)
    if (result) {
      const nav = await utilities.getNav()
      res.locals.nav = nav
      req.flash("success", "New inventory item added successfully.")
      res.render("inventory/management", {
        title: "Inventory Management",
        message: req.flash("message")
      })
    } else {
      throw new Error("Insert failed")
    }
  } catch (error) {
    console.error("Add Inventory Error:", error) 
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("error", "Error: Unable to add inventory.")
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      message: req.flash("message"),
      errors: null,
      ...req.body
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont