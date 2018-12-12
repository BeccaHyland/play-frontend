const url = 'https://infinite-stream-18484.herokuapp.com'
var chosenArtist;
var userArtist = document.querySelector('#userArtist');
var name;
var artist;
var genre;
var rating;

$('#submit-artist').on('click', function () {
  chosenArtist = userArtist.value
  getSongs()
});



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
    bodyRows += '<tr>';

    columns.map(function(colName){
      bodyRows += '<td>' + row[colName] + '<td>';
    });

    bodyRows += '</tr>';
  })

  return '<table class="' +
          classes +
          '"><thead><tr>' +
          headerRow +
          '</tr></thead><tbody>' +
          bodyRows +
          '</tbody></table>';
}

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
