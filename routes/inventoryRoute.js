// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to inventory management view
router.get("/", invController.buildManagement)
// GET add-classification form
router.get("/add-classification", invController.buildAddClassification)
// POST classification form data
router.post(
  "/add-classification",
  classificationValidate.classificationRules,
  classificationValidate.checkClassificationData,
  invController.addClassification
)
// GET inventory Form view
router.get("/add-inventory", invController.buildAddInventory)
// POST inventory Form post
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules,
  inventoryValidate.checkInventoryData,
  invController.addInventory
)
// GET Fetching Inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// GET Route to deliver the "Edit Inventory Item" view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventoryView))
// POST route to handle edit inventory request
router.post(
  "/update/",
  inventoryValidate.inventoryRules,
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// GET route to show the delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInventoryView)
);

// POST route to carry out the delete operation
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;