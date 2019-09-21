const express   = require('express');
const router    = express.Router();

const Campground      = require('../models/campground');

//INDEX - show all campgrounds
router.get('/', (req,res) => {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
router.post('/', (req,res) => {
    var name = req.body.name;  
    var image = req.body.image;
    var desc = req.body.description;
    
    var newCampground = {name: name, image: image, description: desc};
    
    //Create a new campground and save it to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to the campgrounds page
            res.redirect('/campgrounds');
        }
    })
});

//NEW - show form to create new campground   
router.get('/new', (req,res) => {
    res.render('campgrounds/new');
});

//SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
    //find the campground with provided ID.
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            //render the show template with that campground.
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

module.exports = router;
