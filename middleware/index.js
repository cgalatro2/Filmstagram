var Comment = require('../models/comment');
var Movie = require('../models/movie');
module.exports = {
  isLoggedIn: (req, res, next) => {
      if (req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  checkUserMovie: function(req, res, next){
    Movie.findById(req.params.id, function(err, foundMovie){
      if(err || !foundMovie){
          console.log(err);
          req.flash('error', 'Sorry, that movie does not exist!');
          res.redirect('/movies');
      } else if(foundMovie.author.id.equals(req.user._id) || req.user.isAdmin){
          req.movie = foundMovie;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/movies/' + req.params.id);
      }
    });
  },
  checkUserComment: function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campgrounds');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  }
};