var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
   	title: String,
   	image: String,
   	description: String,
   	comments: [
      	{
        	type: mongoose.Schema.Types.ObjectId,
        	ref: "Comment"
      	}
   	],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Movie", movieSchema);