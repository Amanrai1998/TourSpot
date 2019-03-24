var mongoose = require("mongoose"),
    Comment  = require("./comment");

//Schema Setup

var tourspotSchema = new mongoose.Schema({
   name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//Model Setup

module.exports = mongoose.model("Tourspot", tourspotSchema);