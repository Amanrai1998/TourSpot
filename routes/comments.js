var express     = require("express"),
    router      = express.Router({mergeParams: true}),       //mergeParam to use param id in the path
    Tourspot  = require("../models/tourspot"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//New route
// router.get("/new", middleware.isLoggedIn, function(req, res){
//     Tourspot.findById(req.params.id, function(err, tourspot){
//         if(err){
//             req.flash("error", "Something went wrong");
//             res.redirect("back");
//         }else{
//             res.render("comments/new", {tourspot: tourspot});
//         }
//     });
// });

//Create route
router.post("/", middleware.isLoggedIn, function(req, res){
    Tourspot.findById(req.params.id, function(err, tourspot){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("back");
                }else{
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    tourspot.comments.push(newComment._id);
                    tourspot.save();
                    req.flash("success", "Comment created successfully");
                    res.redirect("/tourspots/" + tourspot._id);
                }
            });
        }
    });
});

//edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, currentComment){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            res.render("comments/edit", {comment: currentComment, tourspot_id: req.params.id});
        }
    });
});

//update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            req.flash("success", "Comment updated successfully");
            res.redirect("/tourspots/" + req.params.id);
        }
    });
});

//destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted successfully");
            res.redirect("/tourspots/" + req.params.id);
        }
    })
});

module.exports = router;