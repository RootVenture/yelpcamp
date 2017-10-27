var mongoose = require('mongoose'),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

var data = [{
    name: "Cloud's Rest",
    image: "https://farm5.staticflickr.com/4044/4175370953_5488caf554.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    name: "Desert Mesa",
    image: "https://farm9.staticflickr.com/8572/16034357695_5ca6214f59.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    name: "Canyon Floor",
    image: "https://farm5.staticflickr.com/4100/4798314980_bc31231984.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
    name: "Stoney Peak",
    image: "https://farm5.staticflickr.com/4100/4798314980_bc31231984.jpg",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }
]

function seedDB() {
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err.toString());
    }
    else {
      console.log("removed campgrounds");
      data.forEach(function(seed) {
        Campground.create(seed, function(err, data) {
          if (err) {
            console.log(err.toString());
          }
          else {
            console.log(data);
            Comment.create({
              text: "This is great, but I have no data!",
              author: "Homer"
            }, function(err, comment) {
              if (err) {
                console.log(err.toString());
              }
              else {
                data.comments.push(comment);
                data.save();
                console.log("Created a new comment.")
              }
            })
          }
        })
      })
    }
  })
}

module.exports = seedDB;
