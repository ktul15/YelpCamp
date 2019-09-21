const mongoose        = require('mongoose');
const Campground      = require('./models/campground');
const Comment      = require('./models/comment');

const data = [
    {
        name:'Butterfly Campsite, Lake Garda, Italy', 
        image:'https://i.guim.co.uk/img/media/b02b84b2238dc8b10d21968641e8f7c1839f24b7/0_290_5200_3120/master/5200.jpg?width=860&quality=85&auto=format&fit=max&s=eb6a882966caa48ae41be6c811d77598',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        name:'Kur Camping Erlengrund, Salzburg state, Austria', 
        image:'https://i.guim.co.uk/img/media/761704980b225ca205377eaa82c2cb45eaedc162/0_38_6048_3629/master/6048.jpg?width=860&quality=85&auto=format&fit=max&s=018db05435edb8f70567cb92c378300c',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        name:'Domaine de Sévenier, Ardèche, France', 
        image:'https://i.guim.co.uk/img/media/d34a8142bccb4d0844d3c6cf12cfb6dee4165aa5/0_50_1500_900/master/1500.jpg?width=620&quality=85&auto=format&fit=max&s=1c9c23652c2ece71ecf959c0f4a2294e',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        name:'Butterfly Campsite, Lake Garda, Italy', 
        image:'https://i.guim.co.uk/img/media/b02b84b2238dc8b10d21968641e8f7c1839f24b7/0_290_5200_3120/master/5200.jpg?width=860&quality=85&auto=format&fit=max&s=eb6a882966caa48ae41be6c811d77598',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
]

function seedDB(){
    //Remove All Campgrounds.
    Campground.remove({}, (err) => {
        if(err) console.log(err);

        console.log('Removed ALL campgrounds!');
        //Add few campgrounds.
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if(err) console.log(data);

                console.log('Added Campgrounds');

                //Create a Comment
                Comment.create(
                    {
                        text: 'Comment 1\'s text',
                        author: 'Comment 1\'s author'
                    }, function(err, comment) {
                        if(err) console.log(err);
                        
                        campground.comments.push(comment);
                        campground.save();
                        console.log('New Comment Created!');
                    }
                )
            })
        })
    });
}

module.exports = seedDB;