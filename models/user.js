var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    avatar: {
      type: String,
      default: 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-2.png'
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
