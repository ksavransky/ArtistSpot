var searchArtists = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: `${query}*`,
            type: 'artist'
        },
        success: function (response) {
          typeAheadArtist(response, query);
        }
    });
};

var findArtist = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
          interpretSearchResult(response);
        }
    });
};

var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'album'
        },
        success: function (response) {
            // console.log(response);
        }
    });
};

function interpretSearchResult(result){
  if(result.artists.total == 0){
    console.log("no such artist");
  } else {
    var artist = result.artists.items[0];
    var artistName = artist.name
    console.log(artistName);
    var artistPhotoURL = artist.images[0].url;
    // searchAlbums(artistName);
  }
  clearSearch();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//update results every time user enters a letter in search bar
function typeAheadArtist(result, query){
    if(result.artists.total == 0){
      console.log("no such artist");
    } else {
      var artistNames = [];
      result.artists.items.forEach(artist => artistNames.push(artist.name))
      artistNames = artistNames.filter(function(name){
        var re = new RegExp(query);
        var reCapitalize = new RegExp(capitalizeFirstLetter(query));
        return re.test(name) || reCapitalize.test(name);
      })

      for (var key in artistNames) {
        var optionElement = document.createElement("option");
        optionElement.value = artistNames[key];
        optionElement.innerHTML = artistNames[key];
        document.getElementById("results").appendChild(optionElement);
      }
    }
}

function clearSearch(){
  var myNode = document.getElementById("results");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}

//update results every time user enters a letter in search bar
document.getElementById('search-form').addEventListener('keyup', function (e) {
    e.preventDefault();
    searchArtists(document.getElementById('query').value);
    clearSearch();
}, false);

// pressing enter or clicking on search after typing string in search runs search
document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("submitted");
    findArtist(document.getElementById('query').value);
    document.getElementById("results").focus();
    clearSearch();
    document.getElementById("results").focus();
}, false);

//mouse click on a result runs the search
document.getElementById('results').addEventListener('click', function (e) {
    e.preventDefault();
    console.log("submitted");
    document.getElementById('query').value = document.getElementById('results').value;
    findArtist(document.getElementById('results').value);
}, false);


//pressing enter while highlighting search result, runs the search with the highlighted result
document.getElementById('results').addEventListener('keypress', function (e) {
    e.preventDefault();
    if(e.which == 13) {
      console.log("submitted");
      document.getElementById('query').value = document.getElementById('results').value;
      findArtist(document.getElementById('results').value);
    }
}, false);


//on down press while on query focus on result list and highlight first result
document.getElementById('query').addEventListener('keydown', function (e) {
    if(e.keyCode == 40) {
      e.preventDefault();
      document.getElementById("results").focus();
      document.getElementById("results").selectedIndex = "0";
    }
}, false);

//on up press at top of list focus on search
document.getElementById('results').addEventListener('keydown', function (e) {
    if(e.keyCode == 38 && document.getElementById("results").selectedIndex == 0) {
      e.preventDefault();
      document.getElementById("query").focus();
    }
}, false);





//
//
//
//
//
// // find template and compile it
// // var templateSource = document.getElementById('results-template').innerHTML,
//     // template = Handlebars.compile(templateSource),
//     // resultsPlaceholder = document.getElementById('results')
//     // playingCssClass = 'playing',
//     // audioObject = null;
//
// // var fetchTracks = function (albumId, callback) {
// //     $.ajax({
// //         url: 'https://api.spotify.com/v1/albums/' + albumId,
// //         success: function (response) {
// //             callback(response);
// //         }
// //     });
// // };
// //
// // var searchAlbums = function (query) {
//     $.ajax({
//         url: 'https://api.spotify.com/v1/search',
//         data: {
//             q: query,
//             type: 'album'
//         },
//         success: function (response) {
//             resultsPlaceholder.innerHTML = template(response);
//         }
//     });
// };
