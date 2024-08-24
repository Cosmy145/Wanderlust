const express = require("express");
const router = express.Router();

const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares");
const { signUp, renderSignUpForm, renderLoginForm, login, logout } = require("../controllers/users");

router.route('/signup').get(renderSignUpForm).post(signUp )

router.route('/login').get(renderLoginForm).post(saveRedirectUrl ,passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}) , login)

router.get('/logout', logout);

module.exports = router;
