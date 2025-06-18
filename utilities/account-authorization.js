function checkEmployeeOrAdmin(req, res, next) {
  const user = res.locals.user
  if (user && (user.account_type === "Employee" || user.account_type === "Admin")) {
    return next()
  } else {
    req.flash("notice", "You must be logged in with sufficient privileges to access this page.")
    return res.redirect("/account/login")
  }
}

module.exports = checkEmployeeOrAdmin