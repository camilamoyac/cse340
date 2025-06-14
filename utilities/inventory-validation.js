const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.inventoryRules = [
  body("classification_id").isInt().withMessage("Select a classification."),
  body("inv_make").trim().notEmpty().withMessage("Make is required."),
  body("inv_model").trim().notEmpty().withMessage("Model is required."),
  body("inv_description").trim().notEmpty().withMessage("Description is required."),
  body("inv_image").trim().notEmpty().withMessage("Image path is required."),
  body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
  body("inv_price").isFloat({ gt: 0 }).withMessage("Price must be a number."),
  body("inv_year").isInt({ min: 1900 }).withMessage("Year must be a valid number."),
  body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a number."),
  body("inv_color").trim().notEmpty().withMessage("Color is required."),
]

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    const nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body
    })
    return
  }
  next()
}

module.exports = validate