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
          displaySearchResult(response);
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
        success: function (albumsObject) {
            displayAlbums(albumsObject);
        }
    });
};

var audioObject = null;

var getAlbumTracks = function (albumId) {
  $.ajax({
      url: 'https://api.spotify.com/v1/albums/' + albumId,
      success: function (tracksObject) {
          console.log(tracksObject);
          if(audioObject != null){
            audioObject.pause();
          }
          audioObject = new Audio(tracksObject.tracks.items[0].preview_url);
          audioObject.play();
      }
  });
}

var alreadyPlayingAlbumId = null;

function displayAlbums(albumsObject){
  var albums = albumsObject.albums.items;
  document.getElementById("album-label").style.visibility = "visible";
  for(var i = 0; i < albums.length; i++){
    var albumName = albums[i].name;
    var albumImageURL = albums[i].images[1].url;
    var albumId = albums[i].id;
    var albumDiv = document.createElement('div');
    albumDiv.className = "album-box"

    var textPlayDiv = document.createElement('div');
    textPlayDiv.className = "album-play-text";

    var textDiv = document.createElement('div');
    textDiv.innerHTML = `${albumName}`;
    textDiv.className = "album-text";

    var playImg = document.createElement('img')
    playImg.src = "play.jpg";
    playImg.className = "play-image";

    var img = document.createElement('img');
    img.src = albumImageURL;
    img.className = "album-image";

    textPlayDiv.appendChild(textDiv);
    textPlayDiv.appendChild(playImg);
    textPlayDiv.id = albumId;

    albumDiv.appendChild(textPlayDiv);
    albumDiv.appendChild(img);
    albumDiv.id = albumId;

    textPlayDiv.addEventListener('click', function (e) {
        e.preventDefault();
        console.log(e);
        var spotifyAlbumId = e.path[1].id;
        if(alreadyPlayingAlbumId == spotifyAlbumId){
          audioObject.pause();
          alreadyPlayingAlbumId = null;
        }else {
          getAlbumTracks(spotifyAlbumId);
          alreadyPlayingAlbumId = spotifyAlbumId;
        }
    }, false);

    document.getElementById("album-container").appendChild(albumDiv);
  }
}

function displaySearchResult(result){
  if(result.artists.total == 0){
    document.getElementById("artist-name").innerHTML = "No Such Artist Exists. Please search again.";
    document.getElementById("artist-photo").removeChild(document.getElementById("artist-photo").firstChild);
  } else {
    // if(document.getElementById("start-image")){
    //   var element = document.getElementById("start-image");
    //   element.parentNode.removeChild(element);
    // }

    var artist = result.artists.items[0];
    //display artist name
    var artistName = artist.name
    document.getElementById("artist-name").innerHTML = artistName;
    //display photo of artist
    var artistPhotoURL = artist.images[0].url;
    var img = document.createElement('img')
    img.src = artistPhotoURL;
    img.className = "artist-image";
    if(document.getElementById("artist-photo").firstChild != null){
      document.getElementById("artist-photo").removeChild(document.getElementById("artist-photo").firstChild);
    }
    document.getElementById("artist-photo").appendChild(img);

    searchAlbums(artistName);
  }
  clearSearch();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//update results every time user enters a letter in search bar
function typeAheadArtist(result, query){
    if(result.artists.total != 0){
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
  myNode = document.getElementById("album-container");
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
    findArtist(document.getElementById('query').value);
    document.getElementById("results").focus();
    clearSearch();
    document.getElementById("results").focus();
}, false);

//mouse click on a result runs the search
document.getElementById('results').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('query').value = document.getElementById('results').value;
    findArtist(document.getElementById('results').value);
}, false);


//pressing enter while highlighting search result, runs the search with the highlighted result
document.getElementById('results').addEventListener('keypress', function (e) {
    e.preventDefault();
    if(e.which == 13) {
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
