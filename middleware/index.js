var Tourspot  = require("../models/tourspot"),
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkTourspotOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Tourspot.findById(req.params.id, function(err, currentTourspot){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            if(currentTourspot.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You do not have permissions to do that");
                res.redirect("back");
            }
        }
    });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, currentComment){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else{
            if(currentComment.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You do not have permissions to do that");
                res.redirect("back");
            }
        }
    });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;