var mongoose = require("mongoose");
var Movie = require("./models/movie");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Inglorious Basterds", 
        image: "https://i.pinimg.com/originals/ea/51/a0/ea51a0cec08b8a4fc5af2a60e1ad9efd.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Interstellar", 
        image: "https://images-na.ssl-images-amazon.com/images/I/91kFYg4fX3L.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Arrival", 
        image: "https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
];

function seedDB(){
   //Remove all campgrounds
   Movie.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed movies!");
         //add a few movies
        data.forEach(function(seed){
            Movie.create(seed, function(err, movie){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a movie");
                    //create a comment
                    Comment.create(
                        {
                            text: "Ehhh",
                            author: "George Lucas"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                movie.comments.push(comment);
                                movie.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;