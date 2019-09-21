var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    LocalStrategy   = require('passport-local'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user');
    seedDB          = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp_v3', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

// seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'I lied to them',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// var campgrounds = [
//     {name:'Butterfly Campsite, Lake Garda, Italy', image:'https://i.guim.co.uk/img/media/b02b84b2238dc8b10d21968641e8f7c1839f24b7/0_290_5200_3120/master/5200.jpg?width=860&quality=85&auto=format&fit=max&s=eb6a882966caa48ae41be6c811d77598'},
//     {name:'Kur Camping Erlengrund, Salzburg state, Austria', image:'https://i.guim.co.uk/img/media/761704980b225ca205377eaa82c2cb45eaedc162/0_38_6048_3629/master/6048.jpg?width=860&quality=85&auto=format&fit=max&s=018db05435edb8f70567cb92c378300c'},
//     {name:'Domaine de Sévenier, Ardèche, France', image:'https://i.guim.co.uk/img/media/d34a8142bccb4d0844d3c6cf12cfb6dee4165aa5/0_50_1500_900/master/1500.jpg?width=620&quality=85&auto=format&fit=max&s=1c9c23652c2ece71ecf959c0f4a2294e'},
//     {name:'Butterfly Campsite, Lake Garda, Italy', image:'https://i.guim.co.uk/img/media/b02b84b2238dc8b10d21968641e8f7c1839f24b7/0_290_5200_3120/master/5200.jpg?width=860&quality=85&auto=format&fit=max&s=eb6a882966caa48ae41be6c811d77598'},
//     {name:'Kur Camping Erlengrund, Salzburg state, Austria', image:'https://i.guim.co.uk/img/media/761704980b225ca205377eaa82c2cb45eaedc162/0_38_6048_3629/master/6048.jpg?width=860&quality=85&auto=format&fit=max&s=018db05435edb8f70567cb92c378300c'},
//     {name:'Domaine de Sévenier, Ardèche, France', image:'https://i.guim.co.uk/img/media/d34a8142bccb4d0844d3c6cf12cfb6dee4165aa5/0_50_1500_900/master/1500.jpg?width=620&quality=85&auto=format&fit=max&s=1c9c23652c2ece71ecf959c0f4a2294e'},
//     {name:'Butterfly Campsite, Lake Garda, Italy', image:'https://i.guim.co.uk/img/media/b02b84b2238dc8b10d21968641e8f7c1839f24b7/0_290_5200_3120/master/5200.jpg?width=860&quality=85&auto=format&fit=max&s=eb6a882966caa48ae41be6c811d77598'},
//     {name:'Kur Camping Erlengrund, Salzburg state, Austria', image:'https://i.guim.co.uk/img/media/761704980b225ca205377eaa82c2cb45eaedc162/0_38_6048_3629/master/6048.jpg?width=860&quality=85&auto=format&fit=max&s=018db05435edb8f70567cb92c378300c'},
//     {name:'Domaine de Sévenier, Ardèche, France', image:'https://i.guim.co.uk/img/media/d34a8142bccb4d0844d3c6cf12cfb6dee4165aa5/0_50_1500_900/master/1500.jpg?width=620&quality=85&auto=format&fit=max&s=1c9c23652c2ece71ecf959c0f4a2294e'},
// ]

app.get('/', (req, res) => {
    res.render('landing');
});

//INDEX - show all campgrounds
app.get('/campgrounds', (req,res) => {
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
app.post('/campgrounds', (req,res) => {
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
app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new');
});

//SHOW - shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
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

//-------------------------------------------------------
//COMMENTS
//-------------------------------------------------------

app.get('/campgrounds/:id/comments/new', isLoggedIn , (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err) console.log(err);

        res.render('comments/new', {campground: campground});
    })
})

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

//===========================================
//AUTH ROUTES
//===========================================

//Show register form
app.get('/register', (req, res) => {
    res.render('register');
})
//handle sign up logic
app.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        } 

        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        })
    })
})

//show login form
app.get('/login', (req, res) => {
    res.render('login');
})
//handling login logic
app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
})

//logout route
app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/campgrounds');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
app.listen(8000, () => { console.log('Server Started!')});