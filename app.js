var fs = require("fs");
var port = 4567;
var express = require("express");
var multer = require('multer');
var cors = require('cors');
var mv = require('mv');
var upload = multer({ dest: './public/download/' });

var app = express();
app.use(cors());
app.use(express.static(__dirname + "/public")); //use static files in ROOT/public folder

app.get("/hey", function(request, response){ //root dir
    response.send("Hello!!");
});

app.post('/upload', upload.single('sound'), function (req, res, next) {
    mv(req.file.path, './public/download/sound3.wav',function (err) {
        console.log(err);
    });
    res.send("Hello!!");
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
});


const server = app.listen(port, () => {
    console.log('Listening on port %s', server.address().port)
});