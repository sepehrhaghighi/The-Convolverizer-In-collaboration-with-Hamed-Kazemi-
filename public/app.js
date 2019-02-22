var mic, recorder, soundFile,cverb,button;

var state = 0; // mousePress will increment from Record, to Stop, to Play

function setup() {
  canvas = createCanvas(400,400);
  canvas.style('margin:0 auto;');
  background(200);
  fill(0);
  text('Enable mic and click the mouse to begin recording', 20, 20);


  // create record button
  button = createButton('Record');
  button.style('background-color', 'rgb(255,140,0)');
  button.style('width:100px;');
  button.style('height:100px;');``
  button.style('border-radius:100%;');
  button.style('top:400px');
  button.style('left:150px');
  button.style('position:fixed;');


  button.mousePressed(recordPressed);

  // create an audio in
  mic = new p5.AudioIn();

  // users must manually enable their browser microphone for recording to work properly!
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // create an empty sound file that we will use to playback the recording
  soundFile = new p5.SoundFile();
}

function recordPressed() {
  // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
  if (state === 0 && mic.enabled) {
    background(200);
    // solution to chrome bug issue https://github.com/processing/p5.js-sound/issues/336
    getAudioContext().resume();
    
    // Tell recorder to record to a p5.SoundFile which we will use for playback
    recorder.record(soundFile);

    button.style('background-color', 'rgb(255,0,0)');
    button.html('Stop');
    text('Recording now! Click to stop.', 20, 20);
    state++;
  }

  else if (state === 1) {
    background(200);
    recorder.stop(); // stop recorder, and send the result to soundFile

    button.style('background-color', 'rgb(0,255,0)');
    button.html('Play');
    text('Recording stopped. Click to play', 20, 20);
    state++;
  }

  else if (state === 2) {
    background(200);
    button.style('background-color', 'rgb(100,100,100)');
    button.html('Proceed');
    soundFile.play(); // play the result!
    text('in next state you can use this as a reverb pattern. Click to proceed', 20, 20);
    state++;
  }

  else if (state === 3) {
    background(200);
    button.style('background-color', 'rgb(60,60,255)');
    button.html('Stop Mic');
    // We have both Wav and MP3 versions of all sound assets
    soundFormats("wav", "mp3");

    // get soundFile blob to upload it to server to using as a reverb
    var soundBlob = soundFile.getBlob();

    // Now we can send the blob to a server...
    var serverUrl = 'http://127.0.0.1:4567/upload';
    var xhr = new XMLHttpRequest();
    xhr.open('post', serverUrl, true);
    var formData = new FormData();
    formData.append("sound", soundBlob);
    xhr.send(formData);

    cVerb = createConvolver("/download/sound3.wav");

    // Create an Audio input
    mic = new p5.AudioIn();
    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();


    mic.connect(cVerb);

    text('click to Stop this fucking shit', 20, 20);
    state++;
  }

  else if (state === 4) {
    background(200);
    button.style('background-color', 'rgb(100,60,255)');
    button.html('Repeat');
    // Create an Audio input
    mic.stop();
    text('click to repeat this shit', 20, 20);
    state = 0;
  }
}
