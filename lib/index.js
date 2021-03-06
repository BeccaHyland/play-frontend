const url = 'https://infinite-stream-18484.herokuapp.com/'
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
  fetch(`https://infinite-stream-18484.herokuapp.com/api/v1/favorites`, {
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
  fetch(`https://infinite-stream-18484.herokuapp.com/api/v1/search?q=${chosenArtist}`, {
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

  return '<table id="search"' +
          classes +
          '"><thead><tr>' +
          headerRow +
          '</tr></thead><tbody>' +
          bodyRows +
          '</tbody></table>';
}

$('#artist-search-results').on('click', '.button-add-favorite', function() {
  var songData = this.parentElement.parentElement.childNodes;
  fetchPostFavorite(songData);
})

const getFavorites = () => {
  fetch(`https://infinite-stream-18484.herokuapp.com/api/v1/favorites`)
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
  $('#favorites').append(`<tr>
    <td class='favorite-name'>${name}</td>
    <td class='favorite-artist-name'>${artist} </td>
    <td class='favorite-genre'>${genre} </td>
    <td class='favorite-song-rating'>${rating} </td>
    <td class='favorite-to-playlist'>
    <div class="dropdown">    <button class="dropbtn">Add To Playlist</button> </div>
    </td>
  </tr>`)
	  }
  }

const getPlaylists = () => {
  fetch(`https://infinite-stream-18484.herokuapp.com/api/v1/playlists`)
    .then(response => response.json())
    .then(data => populatePlaylists(data))
    .catch(error => console.error({error}));
}

const populatePlaylists = (data) => {
  for (x = 0 in data) {
      var playlistName = data[x].playlist_name;
      var ranking = Math.round(data[x].ranking);
      var id = data[x].id;
  $('#playlists').append(`<tr>
    <td id='${id}' class='playlist-name'> ${playlistName}<button class='playlist-show-button'>Check Songs</button></td>
    <td class='playlist-ranking'>${ranking} </td>
  </tr>`)
  }
}

const populateAddPlaylist = (data) => {
  for (x = 0 in data) {
      var playlistName = data[x].playlist_name;
      var id = data[x].id;
      $('.dropdown-content').append(`<a href="" id='${id}' class='dropdown-link-${id}'>${playlistName}</a></br>`)

    $(`.dropdown-content`).on('click', `.dropdown-link-${id}`, function() {
      console.log("------------------HERE----------------")
      var songData = this.parentElement.parentElement.childNodes;
      addSongToPlaylist(songData);
    })
  }
}

const addSongToPlaylist = (songData) => {
  console.log(songData)
  fetch(`https://infinite-stream-18484.herokuapp.com/api/v1/playlists/:playlist_id/songs/:id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      'favorite_id': songData[0].innerHTML.id,
      'playlist_id': songData[2].innerHTML.id
    })
  })
}

populateAddPlaylist();
getPlaylists();
getFavorites();
