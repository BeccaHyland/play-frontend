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
    .then(data => artistData(data))
    .catch(error => console.error({error}));
}

const artistData = (data) => {
  for (x = 0 in data) {
      name = data[x].name;
      artist = data[x].artist_name;
      genre = data[x].genre;
      rating = data[x].song_rating
    $('#song-result').append(`<p class='name'>${name}</p><p class='artist'>${artist}</p><p class='genre'>${genre}</p><p class='rating'>${rating}</p>`)
  };
}
