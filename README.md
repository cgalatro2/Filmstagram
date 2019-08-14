# Yellowcake

[Filmstagram](https://evening-fortress-41477.herokuapp.com/) is my first solo-project, created with the intention of refining my ability to implement a full-stack web application using RESTful routing.

NOTE: This project is still in the works. Most of the functionality is already implemented; however, it still needs to be styled and a handful more aspects ("like" button, image uploading, etc.) need to be added.

This app has most of the same functionality as the website after which it is modeled, Instagram. Users can create, edit, and delete their own posts, along with leave comments on both their own publications as well as those of other users. Filmstagram is hosted on a Heroku server, was created using the Node.js JavaScript run-time environment, and contains more than 1,200 lines of code.

The following NPM-installed packages, among others, allow for the functionality of this application:

- Request, which provides access to the [OMDb API](http://omdbapi.com/) and gives the user search capabilities
- Mongoose, which facilitates MongoDB object modeling
- Passport, for authenticating users and requests
- Express-session, which allows sessions to identify users across requests
