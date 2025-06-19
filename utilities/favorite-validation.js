const { body } = require("express-validator");

const validateFavorite = [
  body("inv_id")
    .trim()
    .isInt({ gt: 0 })
    .withMessage("A valid vehicle ID is required."),
];

module.exports = { validateFavorite };