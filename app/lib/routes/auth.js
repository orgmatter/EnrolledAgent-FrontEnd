const router = require("express").Router();
const { handleSocial, verify, passwordResetLink, passwordResetPage } = require("../controllers/auth");
const passport = require("passport");
// const exceptions = ['/login', '/logout', '/register', '/', '/google/callback', '/facebook/callback', '/linkedin/callback']
const { PageAnalyticsService, Helper } = require("common");




router

    .get("/logout", (req, res) => {
        req.logout();
        res.redirect("/login",);
        PageAnalyticsService.inc('/logout')
    })
    .get("/reset/:token", passwordResetLink)
    .get("/reset-password", passwordResetPage, (req, res) => {
        res.render("resetPassword", { locals: req.locals });
        PageAnalyticsService.inc('/reset-password')
    })
    .get("/forgot-password", (req, res) => {
        res.render("forgotPassword", { locals: req.locals });
        PageAnalyticsService.inc('/forgot-password')
    })
    .get("/resend-verification", (req, res) => {
        res.render("resendVerification", { locals: req.locals });
        PageAnalyticsService.inc('/resend-verification')
    })
    .get("/login",  Helper.setRedirectCookie, (req, res) => {
        res.render("login", { locals: req.locals });
        PageAnalyticsService.inc('/login')
    })
    .get("/register",  Helper.setRedirectCookie, (req, res) => {
        res.render("signup", { locals: req.locals });
        PageAnalyticsService.inc('/register')
    })
    .get("/facebook/callback", function (req, res, next) {
        passport.authenticate("facebook", function (err, user, info) {
            handleSocial(req, res, next, err, user, info);
        })(req, res, next);
        PageAnalyticsService.inc('/facebook/callback')
    })
    .get("/google/callback", function (req, res, next) {
        passport.authenticate(
            "google",
            { scope: ["profile", "email"] },
            function (err, user, info) {
                // console.log('google', user, info, err)
                handleSocial(req, res, next, err, user, info);
            }
        )(req, res, next);
        PageAnalyticsService.inc('/google/callback')
    })
    .get("/linkedin/callback", function (req, res, next) {
        passport.authenticate("linkedin", function (err, user, info) {
            handleSocial(req, res, next, err, user, info);
        })(req, res, next);
        PageAnalyticsService.inc('/linkedin/callback')
    })

module.exports = router
