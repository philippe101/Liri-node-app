// There is something wrong with my code but I can't find what it is. The movie app was working 
// for a while displaying Mr. Nobody and the rest of the info but then it stopped working and
// I dont know why.  
// I have tried to replace the twitter tokens but I kept getting the same ones. 
// I'm still working on it.


var fs = require('fs');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var keys = require("./keys.js");

var cmdInput = process.argv[2];

// var args = process.argv.slice(2);

logged()

// getInput(cmdInput);

function getInput(cmdInput, args) {
	if (logged()) {
		switch (cmdInput) {
		case 'my-tweets':
			myTweets();
			break;
		case 'spotify-this-song':
			if (args) {
				console.log(' Argument passed: ' + args);
				spotifySong(args);
			}
			else {
				if (process.argv[3] != null) {
					var song = process.argv.slice(3).join('+');
					spotifySong(song);
				}
				else {
					spotifySong('The Sign');
				}
			}
			break;
		case 'movie-this':
			if (args) {
				myMovieDetails(args);
			}
			else {
				var movie = process.argv.slice(3).join('+');
				myMovieDetails(movie);
			}
			break;
		case 'do-what-it-says':
			DoWhatItSays();
			break;
		}
	}
}

function myTweets() {
	var client = new Twitter(keys.twitterKeys);
	var params = {
		screen_name: 'philippe_101',
		count: 10
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log('')
				console.log('-----------------------------------------')
				console.log(' Tweet: ' + tweets[i].text)
				console.log('')
				console.log(' Tweet Number: ' + (i + 1))
				console.log('')
				console.log(' Created: ' + tweets[i].created_at)
				console.log('-----------------------------------------')
				console.log('')
			}
		}
	});
}

function spotifySong(song) {
	spotify.search({
		'type': 'track',
		'query': song
	}, function (error, data) {
		if (error) {
			console.log(error + '\n');
	}
		else {
				console.log('')
				console.log('-----------------------------------------')
				console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
				console.log('')
				console.log('Song Name: ' + data.tracks.items[0].name);
				console.log('') 
				console.log('Preview URL: ' + data.tracks.items[0].preview_url);
				console.log('')
				console.log('Album Name: ' + data.tracks.items[0].album.name);
				console.log('-----------------------------------------')
				console.log('')
		}
	});
}

function myMovieDetails(movie) {
	var query = 'http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece';

	request(query, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			var movieDetails = JSON.parse(body);
	
		if (movieDetails.Response === 'False') {
			myMovieDetails('Mr. Nobody');
		}
		else {
				console.log('')
				console.log('-----------------------------------------')
				console.log(' Title: ' + JSON.parse(body)['Title']);
				console.log(' Release Year: ' + JSON.parse(body)['Released']);
				console.log(' IMDB Rating: ' + JSON.parse(body)['imdbRating']);
				console.log(' Country: ' + JSON.parse(body)['Country']);
				console.log(' Language: ' + JSON.parse(body)['Language']);
				console.log(' Plot: ' + JSON.parse(body)['Plot']);
				console.log(' Actors: ' + JSON.parse(body)['Actors']);
				console.log('-----------------------------------------')
				console.log('')
				
			}
		}
	});
}


function DoWhatItSays() {
	fs.readFile('random.txt', 'utf-8', function (error, data) {
		var fileCommands = data.split(',');
		getInput(fileCommands[0], fileCommands[1]);
	});
}

function logged() {
	var inputs = process.argv.slice(2).join(" ");

	fs.appendFile("log.txt", "node liri.js: " + inputs + "\n", function (error) {
		if (error) {
			throw error;
		}
		else {
			console.log("updated log file!");
		}
	});
	// return true;
}
// return







