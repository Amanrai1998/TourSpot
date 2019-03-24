var mongoose = require("mongoose");

//Comment Schema

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,        //can only be done using nonsql db
            ref: "User"
        },
        username: String
    }
});

//Comment Model

module.exports = mongoose.model("Comment", commentSchema);