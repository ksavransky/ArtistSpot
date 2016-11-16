var searchArtist = function (query) {
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

// function interpretSearchResult(result){
//   if(result.artists.total == 0){
//     console.log("no such artist");
//   } else {
//     var artist = result.artists.items[0];
//     var artistName = artist.name
//     var artistPhotoURL = artist.images[0].url;
//     searchAlbums(artistName);
//   }
// }

document.getElementById('search-form').addEventListener('keyup', function (e) {
    e.preventDefault();
    searchArtist(document.getElementById('query').value);
}, false);

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchArtist(document.getElementById('query').value);
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
      console.log(artistNames);
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
