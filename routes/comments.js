const express = require("express");
const router  = express.Router({mergeParams: true});
const Movie = require("../models/movie");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const { isLoggedIn, checkUserComment, isAdmin } = middleware;

//Comments New
router.get("/new", isLoggedIn, (req, res) => {
    // find movie by id
    console.log(req.params.id);
    Movie.findById(req.params.id, (err, movie) => {
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {movie: movie});
        }
    });
});

//Comments Create
router.post("/", isLoggedIn, (req, res) => {
   //lookup movie using ID
   Movie.findById(req.params.id, (err, movie) => {
       if (err) {
           console.log(err);
           res.redirect("/movies");
       } else {
        Comment.create(req.body.comment, (err, comment) => {
           if (err) {
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               movie.comments.push(comment);
               movie.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/movies/' + movie._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", isLoggedIn, checkUserComment, (req, res) => {
  res.render("comments/edit", {movie_id: req.params.id, comment: req.comment});
});

router.put("/:commentId", isAdmin, function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, comment) => {
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/movies/" + req.params.id);
       }
   });
});

router.delete("/:commentId", isLoggedIn, checkUserComment, (req, res) => {
  // find movie, remove comment from comments array, delete comment in db
  Movie.findByIdAndUpdate(req.params.id, {
    $pull: {
      comments: req.comment.id
    }
  }, (err) => {
    if(err){
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/');
    } else {
        req.comment.remove((err) => {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('/');
          }
          req.flash('error', 'Comment deleted!');
          res.redirect("/movies/" + req.params.id);
        });
    }
  });
});

module.exports = router;
