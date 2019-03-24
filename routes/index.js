var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    passport    = require("passport");

//Home Route

router.get("/",function(req, res){
	res.render("landing");
});

router.get("/register",function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/tourspots");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/tourspots",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Successfully logged in"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/tourspots");
});

module.exports = router;