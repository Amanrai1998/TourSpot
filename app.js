var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    flash           = require("connect-flash"),
    Tourspot      = require("./models/tourspot"),
    Comment         = require("./models/comment"),
    User            = require("./models/user")

//requiring routes
var indexRoutes         = require("./routes/index"),
    tourspotRoutes   = require("./routes/tourspots"),
    commentRoutes       = require("./routes/comments");

mongoose.connect("mongodb://localhost:27017/TourSpot");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

//passport setups
app.use(session({
    secret: "What the hell is this secret",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  //or use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
}); 

//using routes
app.use("/", indexRoutes);
app.use("/tourspots", tourspotRoutes);
app.use("/tourspots/:id/comments", commentRoutes);

app.listen(process.env.PORT,function(){
	console.log("Server is started");
});