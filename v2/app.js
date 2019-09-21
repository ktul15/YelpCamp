var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//     {
//         name: 'Kur Camping Erlengrund, Salzburg state, Austria', 
//         image: 'https://i.guim.co.uk/img/media/761704980b225ca205377eaa82c2cb45eaedc162/0_38_6048_3629/master/6048.jpg?width=860&quality=85&auto=format&fit=max&s=018db05435edb8f70567cb92c378300c',
//         description: 'Tjdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
//     }, (err, campground) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log('New Campground: ', campground);
//         }
//     }
// );

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
            res.render('index', {campgrounds:allCampgrounds});
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
    res.render('new');
});

//SHOW - shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
    //find the campground with provided ID.
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render the show template with that campground.
            res.render('show', {campground: foundCampground});
        }
    });
});


app.listen(8000, () => { console.log('Server Started!')});