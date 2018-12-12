const url = 'https://infinite-stream-18484.herokuapp.com'
var chosenArtist;
var userArtist = document.querySelector('#userArtist');


$('#submit-artist').on('click', function () {
  chosenArtist = userArtist.value
  getSongs()
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
  console.log(data)
}
