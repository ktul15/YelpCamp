const express   = require('express');
const router    = express.Router(); 

const Campground      = require('../models/campground');
const Comment         = require('../models/comment');

//new comment
router.get('new', isLoggedIn , (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err) console.log(err);

        res.render('comments/new', {campground: campground});
    })
})

//create comment
router.post('/', isLoggedIn, (req, res) => {
    //lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if(err) { 
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
})

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
