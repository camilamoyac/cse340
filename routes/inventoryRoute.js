// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to inventory management view
router.get("/", invController.buildManagement)
// GET add-classification form
router.get("/add-classification", invController.buildAddClassification)
// POST form data
router.post(
  "/add-classification",
  classificationValidate.classificationRules,
  classificationValidate.checkClassificationData,
  invController.addClassification
)

module.exports = router;