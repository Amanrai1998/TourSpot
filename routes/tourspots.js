var express     = require("express"),
    router      = express.Router(),
    Tourspot  = require("../models/tourspot"),
    middleware  = require("../middleware");     //auto look for index .js inside

//Tourspots View Route
router.get("/",function(req, res){
    Tourspot.find({},function(err, allTourspots){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            res.render("tourspots/index",{tourspots: allTourspots});
        }
    });
});

//Create Route
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to campground array
	var newTourspot = req.body.tourspot;
	Tourspot.create(newTourspot, function(err, newTourspot){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            newTourspot.author.id = req.user._id;
            newTourspot.author.username = req.user.username;
            newTourspot.save();
            //redirect to campgroung page
            req.flash("success", "TourSpot added successfully");
	        res.redirect("/tourspots");
        }
    });
});

//New Route
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("tourspots/new");
});

//Show Route
router.get("/:id", function(req, res){
    Tourspot.findById(req.params.id).populate("comments").exec(function(err, foundTourspot){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            res.render("tourspots/show", {tourspot: foundTourspot});
        }
    });
});

//edit route
router.get("/:id/edit", middleware.checkTourspotOwnership, function(req, res){
    Tourspot.findById(req.params.id, function(err, currentTourspot){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            res.render("tourspots/edit", {tourspot: currentTourspot});
        }
    });
});

//update route
router.put("/:id", middleware.checkTourspotOwnership, function(req, res){
    Tourspot.findByIdAndUpdate(req.params.id, req.body.tourspot, function(err, updatedTourspot){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            req.flash("success", "TourSpot updated successfully");
            res.redirect("/tourspots/" + updatedTourspot._id);
        }
    });
});

//destroy route
router.delete("/:id", middleware.checkTourspotOwnership, function(req, res){
    Tourspot.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            req.flash("success", "TourSpot deleted successfully");
            res.redirect("/tourspots");
        }
    })
});

router.get("/search/:input", function(req,res){
    Tourspot.find({},function(err, allTourspots){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            allTourspots = allTourspots.filter(tourspot=> tourspot.name.includes(req.params.input));
            res.render("tourspots/index",{tourspots: allTourspots});
        }
    });
});

module.exports = router;