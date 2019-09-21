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

//requiring Routes
const campgroundRoutes      = require('./routes/campground');
      commentRoutes         = require('./routes/comments');
      indexRoutes            = require('./routes/index');

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

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments/', commentRoutes);

//Server setup
app.listen(8000, () => { console.log('Server Started!')});

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

