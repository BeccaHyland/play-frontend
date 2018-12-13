/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	var url = 'https://infinite-stream-18484.herokuapp.com/';
	var chosenArtist;
	var userArtist = document.querySelector('#userArtist');
	var name;
	var artist;
	var genre;
	var rating;
	var buttonClass;

	$('#submit-artist').on('click', function () {
	  chosenArtist = userArtist.value;
	  getSongs();
	});

	var fetchPostFavorite = function fetchPostFavorite(songDataFromButton) {
	  // using fetch, send the JSON to the backend POST FAVORITE endpoint
	  fetch(url + '/api/v1/favorites', {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      'name': songDataFromButton[0].innerHTML,
	      'artist_name': songDataFromButton[2].innerHTML,
	      'genre': songDataFromButton[4].innerHTML,
	      'song_rating': songDataFromButton[6].innerHTML
	    })
	  });

	  document.getElementById('favorite-feedback').innerHTML = '***Added ' + songDataFromButton[0].innerHTML + ' to Favorites!***';
	};

	document.addEventListener('keydown', function (event) {
	  if (event.which == 13) {
	    chosenArtist = userArtist.value;
	    getSongs();
	  }
	});

	var getSongs = function getSongs() {
	  fetch(url + '/api/v1/search?q=' + chosenArtist, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      'artist': chosenArtist
	    })
	  }).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    return populateArtistSearchResults(data);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var populateArtistSearchResults = function populateArtistSearchResults(incomingJson) {
	  document.getElementById('artist-search-results').innerHTML = jsonToTable(incomingJson);
	};

	var jsonToTable = function jsonToTable(json, classes) {
	  var columns = Object.keys(json[0]);
	  var headerRow = '';
	  var bodyRows = '';
	  classes = classes || '';

	  var capitalizeFirst = function capitalizeFirst(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	  };

	  columns.map(function (col) {
	    headerRow += '<th>' + capitalizeFirst(col) + '</th>';
	  });

	  json.map(function (row) {
	    bodyRows += '<tr id="' + row["name"].split(" ").join("-") + '">';

	    columns.map(function (colName) {
	      bodyRows += '<td class="colName">' + row[colName] + '<td>';
	    });
	    bodyRows += '<button class="button-add-favorite" id= ' + row["name"].split(" ").join("-") + '">Add "' + row["name"] + '" to my Favorites</button></tr>';
	  });

	  return '<table class="' + classes + '"><thead><tr>' + headerRow + '</tr></thead><tbody>' + bodyRows + '</tbody></table>';
	};

	$('#artist-search-results').on('click', '.button-add-favorite', function () {
	  var songData = this.parentElement.parentElement.childNodes;
	  fetchPostFavorite(songData);
	});

	var getFavorites = function getFavorites() {
	  fetch(url + '/api/v1/favorites').then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    return populateFavorites(data);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var populateFavorites = function populateFavorites(data) {
	  for (var _ref in data) {
	    var _ref2 = _ref,
	        x = _ref2 === undefined ? 0 : _ref2;

	    name = data[x].name;
	    artist = data[x].artist_name;
	    genre = data[x].genre;
	    rating = data[x].song_rating;
	    $('#user-favorites').append('<tr>\n    <td class=\'favorite-name\'>' + name + '</td>\n    <td class=\'favorite-artist-name\'>' + artist + ' </td>\n    <td class=\'favorite-genre\'>' + genre + ' </td>\n    <td class=\'favorite-song-rating\'>' + rating + ' </td>\n    <td class=\'favorite-to-playlist\'>\n    <div class="dropdown">\n    <button class="dropbtn">Add To Playlist</button>\n    <div class="dropdown-content">\n    <a href="#" id=\'id\' class=\'dropdown-link\'> </a>\n  </div>\n</div> </td>\n  </tr>');
	  }
	};

	var getPlaylists = function getPlaylists() {
	  fetch(url + '/api/v1/playlists').then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    return populatePlaylists(data);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var populatePlaylists = function populatePlaylists(data) {
	  for (var _ref3 in data) {
	    var _ref4 = _ref3,
	        x = _ref4 === undefined ? 0 : _ref4;

	    var playlistName = data[x].playlist_name;
	    var ranking = data[x].ranking;
	    var id = data[x].id;
	    $('#user-playlists').append('<tr>\n    <td id=\'' + id + '\' class=\'playlist-name\'> ' + playlistName + '<button class=\'playlist-show-button\'>Check Songs</button></td>\n    <td class=\'playlist-ranking\'>' + ranking + ' </td>\n  </tr>');
	  }
	  populateAddPlaylist(data);
	};

	var populateAddPlaylist = function populateAddPlaylist(data) {
	  for (var _ref5 in data) {
	    var _ref6 = _ref5,
	        x = _ref6 === undefined ? 0 : _ref6;

	    var playlistName = data[x].playlist_name;
	    var id = data[x].id;
	    $('.dropdown-content').append('<a href="" id=\'' + id + '\' class=\'dropdown-link\'>' + playlistName + '</a></br>');
	  }
	};

	$('.dropdown-link').on('click', function () {
	  var songData = this.parentElement.childNodes;
	  console.log(songData);
	  fetchPostFavorite(songData);
	});

	getPlaylists();
	getFavorites();

/***/ })
/******/ ]);