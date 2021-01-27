var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, maxlength: 100},
    email: {type: String, maxlength: 320}, // source: stackoverflow
    location: {type: String, maxlength: 100},
    bio: {type: String, maxlength: 300},
    pic: {
        data: Buffer,
        contentType: String
    },
    username: {type: String, required: true, minlength: 8, maxlength: 20},
    password: {type: String, required: true, minlength: 8, maxlength: 20}
})
module.exports = mongoose.model("user", userSchema);