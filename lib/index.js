const url = 'https://infinite-stream-18484.herokuapp.com'
var chosenArtist;
var userArtist = document.querySelector('#userArtist');
var name;
var artist;
var genre;
var rating;
var buttonClass;

$('#submit-artist').on('click', function () {
  chosenArtist = userArtist.value
  getSongs()
});


const fetchPostFavorite = (songDataFromButton) => {
  // using fetch, send the JSON to the backend POST FAVORITE endpoint
  fetch(`http://localhost:3000/api/v1/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': songDataFromButton[0].innerHTML,
      'artist_name': songDataFromButton[2].innerHTML,
      'genre': songDataFromButton[4].innerHTML,
      'song_rating': songDataFromButton[6].innerHTML,
    })
  })

  document.getElementById('favorite-feedback').innerHTML = `***Added ${songDataFromButton[0].innerHTML} to Favorites!***`
}

document.addEventListener('keydown', (event) => {
  if ( event.which == 13 ) {
    chosenArtist = userArtist.value
    getSongs()
  }
});

const getSongs = () => {
  fetch(`http://localhost:3000/api/v1/search?q=${chosenArtist}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      'artist': chosenArtist
    })
  })
    .then(response => response.json())
    .then(data => populateArtistSearchResults(data))
    .catch(error => console.error({error}));
}

const populateArtistSearchResults = (incomingJson) => {
  document.getElementById('artist-search-results').innerHTML = jsonToTable(incomingJson);
}

const jsonToTable = (json, classes) => {
  var columns = Object.keys(json[0]);
  var headerRow = '';
  var bodyRows = '';
  classes = classes || '';

  const capitalizeFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  columns.map(function(col) {
    headerRow += '<th>' + capitalizeFirst(col) + '</th>';
  });

  json.map(function(row) {
    bodyRows += `<tr id="${(row["name"].split(" ")).join("-")}">`;

    columns.map(function(colName){
      bodyRows += `<td class="colName">` + row[colName] + '<td>';
    });
    bodyRows += `<button class="button-add-favorite" id= ${(row["name"].split(" ")).join("-")}">Add "${row["name"]}" to my Favorites</button></tr>`;
  })

  return '<table class="' +
          classes +
          '"><thead><tr>' +
          headerRow +
          '</tr></thead><tbody>' +
          bodyRows +
          '</tbody></table>';
}

$('#artist-search-results').on('click', '.button-add-favorite', function() {
  var songData = this.parentElement.parentElement.childNodes;
  // console.log(songData[0].innerHTML);
  fetchPostFavorite(songData);
})

const getFavorites = () => {
  fetch(`http://localhost:3000/api/v1/favorites`)
    .then(response => response.json())
    .then(data => populateFavorites(data))
    .catch(error => console.error({error}));
}

const populateFavorites = (data) => {
  for (x = 0 in data) {
      name = data[x].name;
      artist = data[x].artist_name;
      genre = data[x].genre;
      rating = data[x].song_rating
  $('#user-favorites').append(`<tr>
    <td class='favorite-name'>${name}</td>
    <td class='favorite-artist-name'>${artist} </td>
    <td class='favorite-genre'>${genre} </td>
    <td class='favorite-song-rating'>${rating} </td>
  </tr>`)
  }
}

const getPlaylists = () => {
  fetch(`http://localhost:3000/api/v1/playlists`)
    .then(response => response.json())
    .then(data => populatePlaylists(data))
    .catch(error => console.error({error}));
}

const populatePlaylists = (data) => {
  for (x = 0 in data) {
      var playlistName = data[x].playlist_name;
      var ranking = data[x].ranking;
  $('#user-playlists').append(`<tr>
    <td class='playlist-name'> ${playlistName}</td>
    <td class='playlist-ranking'>${ranking} </td>
  </tr>`)
  }
}

getFavorites();
getPlaylists();
// const artistData = (data) => {
//   // console.log(data)
//   for (x = 0 in data) {
//     name = data[x].name;
//     artist = data[x].artist_name;
//     genre = data[x].genre;
//     rating = data[x].song_rating
//     $('#song-result').append(`<ul class='square'>
//     <li><p class='name'>${name}</p></li>
//     <li><p class='artist'>${artist}</p></li>
//     <li><p class="genre">${genre}</p></li>
//     <li><p class="rating">${rating}</p></li>
//     <li><p><button class="button-favorite" type="button">Add Favorite</button></p><br><li>
//     </ul>`)
//   };
// }
