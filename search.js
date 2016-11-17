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

function clearSearch(){
  var myNode = document.getElementById("results");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }
}

document.getElementById('search-form').addEventListener('keyup', function (e) {
    e.preventDefault();
    searchArtists(document.getElementById('query').value);
    clearSearch();
}, false);

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("submitted");
    // pressing enter or clicking on search after typing string in search runs search
    findArtist(document.getElementById('query').value);
}, false);

document.getElementById('results').addEventListener('click', function (e) {
    e.preventDefault();
    console.log("submitted");
    //mouse click on a result runs the search
    document.getElementById('query').value = document.getElementById('results').value;
    findArtist(document.getElementById('results').value);
}, false);


document.getElementById('results').addEventListener('keypress', function (e) {
    e.preventDefault();
    //pressing enter while highlighting search result, runs the search with the highlighted result
    if(e.which == 13) {
      console.log("submitted");
      document.getElementById('query').value = document.getElementById('results').value;
      findArtist(document.getElementById('results').value);
    }
}, false);



document.getElementById('query').addEventListener('keydown', function (e) {
    if(e.keyCode == 40) {
      e.preventDefault();
      // document.getElementById("results").selectedIndex = "1"
      // console.log(document.getElementById('results').firstChild);
      document.getElementById("results").focus();
    }
}, false);


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
      // console.log(artistNames);

      for (var key in artistNames) {
        var optionElement = document.createElement("option");
        optionElement.value = artistNames[key];
        optionElement.innerHTML = artistNames[key];
        // optionElement.click = findArtist(artistNames[key]);
        // optionElement.onclick = "console.log(artistNames[key]);"
        // console.log(optionElement);
        document.getElementById("results").appendChild(optionElement);
      }
    }
}


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
