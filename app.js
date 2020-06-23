const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const { send } = require("process");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const port = 3000;
app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);

const songdata = JSON.parse(fs.readFileSync("songdata.JSON"));
const videodata = JSON.parse(fs.readFileSync("videodata.JSON"));


//Find all songs (array)
app.get("/songs", (req, res) => {
	let tempsongs = [];
	for (var x = 0; x < songdata.results.length; x++) {
		tempsongs.push(songdata.results[x].trackName);
	}
	res.send(tempsongs);
});

app.get("/songs/id/:id", (req, res) => {
	let song = "";

	for (var x = 0; x < songdata.results.length; x++) {
		if (songdata.results[x].trackId == req.params.id) {
			song = songdata.results[x].trackName;
			res.send("Song: " + song);
		}
    }
    
    //Cant find song
    res.send(404);
});

//Find songs by name /song/:artistid (string)
app.get("/songs/artistid/:artistid", (req, res) => {
	let songs = [];

	for (var x = 0; x < songdata.results.length; x++) {
		if ( songdata.results[x].artistId  == req.params.artistid) {
			songs.push(songdata.results[x].trackName);
		}
	}
	res.send("Songs by artist ID: " + songs);
});


//Find songs by name /song/:artistname (string)
app.get("/songs/artistname/:artistname", (req, res) => {
	let songs = [];

	for (var x = 0; x < songdata.results.length; x++) {
		if (
			songdata.results[x].artistName.toUpperCase() ==
			req.params.artistname.toUpperCase()
		) {
			songs.push(songdata.results[x].trackName);
		}
	}
	res.send("Songs by artist name: " + songs);
});

//xFind songs by album id /songs/album/id/:id (string collection id)
app.get("/songs/album/id/:id", (req, res) => {
	let songs = [];
	let album = "";

	for (let x = 0; x < songdata.results.length; x++) {
		if (songdata.results[x].collectionId == req.params.id) {
			songs.push(songdata.results[x].trackName);
			album = songdata.results[x].collectionName;
		}
	}

	res.send("Songs from " + album + ": " + songs); //1440857781
});

// Find songs by album name /song/album/:albumname  (collection name)

app.get("/songs/album/albumname/:albumname", (req, res) => {
	let songs = [];

	for (let x = 0; x < songdata.results.length; x++) {
		if (songdata.results[x].collectionName == req.params.albumname) {
			songs.push(songdata.results[x].trackName);
		}
	}
	res.send("Songs from " + req.params.albumname + ": " + songs); //1440857781
});

//Update song information by id
app.patch("/update/:id", (req, res) => {
	let resNum;

	//Get the Result Number to change
	for (let x = 0; x < songdata.results.length; x++) {
		if (songdata.results[x].trackId == req.params.id) {
			resNum = x;
			break;
		}
	}

	let objChanges = req.body;
	let objClone = { ...songdata.results[resNum], ...objChanges };

	songdata.results.splice(resNum, 1, objClone);

	res.send("Updated Info");
});

//Delete a song by id
app.delete("/delete/:id", (req, res) => {
    let resNum;
	for (var x = 0; x < songdata.results.length; x++) {
		if (songdata.results[x].trackId == req.params.id) {
            resNum = x;
            break;
		}
    }
    songdata.results.splice(resNum,1);
    res.send("Deleted trackId: " + req.params.id);
})

app.post("/addnew", (req,res) => {

    let bodyObj = req.body;

    let newObj = {...bodyObj};

    songdata.results.push(newObj)

    res.send("Song Added")
})

/////////////////////////////////////////////Music Videos

app.get("/videos", (req, res) => {
	let tempvideos = [];
	for (var x = 0; x < videodata.results.length; x++) {
		tempvideos.push(videodata.results[x].trackName);
	}
	res.send("All Videos: \n" + tempvideos);
});

app.get("/videos/id/:id", (req, res) => {

	for (var x = 0; x < videodata.results.length; x++) {
		if (videodata.results[x].trackId == req.params.id) {
			res.send(videodata.results[x].previewUrl);
		}
    }
    
    //Cant find Video
    res.send(404);
});