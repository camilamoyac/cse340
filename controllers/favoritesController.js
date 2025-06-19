const utilities = require("../utilities/")
const favoritesModel = require("../models/favorites-model")
const { validationResult } = require("express-validator");

// POST /account/favorites/add
async function addFavorite(req, res) {
  const referer = req.get("Referer") || "/";
  const inv_id = req.body.inv_id;
  const account_id = res.locals.user?.account_id

  // Check if user is logged in
  if (!account_id) {
    req.flash("notice", "Please log in to add favorites.")
    return res.redirect("/account/login")
  }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array()[0].msg || "Invalid input.";
    req.flash("notice", `Something went wrong. ${errorMsg}`);
    return res.redirect(referer);
  }

   // Check if inv_id exists
  if (!inv_id) {
    req.flash("notice", "Something went wrong. Vehicle ID not provided.");
    return res.redirect(referer);
  }

  // Check for duplicate favorite
  const alreadyAdded = await favoritesModel.isFavoriteAlreadyAdded(account_id, inv_id);
  if (alreadyAdded) {
    req.flash("notice", "This vehicle is already in your favorites.");
    return res.redirect(referer);
  }

  // Add favorite
  const success = await favoritesModel.addFavorite(account_id, inv_id);
  req.flash(
    "notice",
    success ? "Vehicle added to your favorites." : "Failed to add vehicle to favorites."
  );
  return res.redirect(referer);
}

// GET /account/favorites
async function viewFavorites(req, res) {
  const account_id = res.locals.user.account_id
  const nav = await utilities.getNav()

  try {
    const favorites = await favoritesModel.getFavoritesByAccount(account_id)
    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites,
    })
  } catch (error) {
    req.flash("notice", "Could not load favorites.")
    res.redirect("/account")
  }
}

module.exports = {
  addFavorite,
  viewFavorites,
}