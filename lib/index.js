const url = 'https://infinite-stream-18484.herokuapp.com'
var choosedArtist;
var userArtist = document.querySelector('#userArtist');

$('#submit-artist').on('click', function () {
  choosedArtist = userArtist.value
  getSongs()
})

const getSongs = () => {
  fetch(`${url}/api/v1/search?q=${choosedArtist}`)
    .then(response => response.json())
    .then(data => artistData(data))
    .catch(error => console.error({error}))
}

const artistData = (data) => {
  console.log(data)
}
