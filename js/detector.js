var divRoot = $("#affdex_elements")[0];
var width = 280;
var height = 220;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

// Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

// Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();
detector.start();

// Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function () {
  // Display canvas instead of video feed because we want to draw the feature points on it
  $("#face_video_canvas").css("display", "none");
  $("#face_video").css("display", "none");



});

function log(node_name, msg) {
  $(node_name).append("<span>" + msg + "</span><br />")
}

// Function executes when Start button is pushed.
function onStart() {
  if (detector && !detector.isRunning) {
    $("#logs").html("");
    detector.start();
  }
}

// Function executes when Stop button is pushed
function onStop() {
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
  }
};

// Function executes when Reset button is pushed
function onReset() {
  if (detector && detector.isRunning) {
    detector.reset();

    $('#results').html("");
  }
};

// Checks for Webcam access
detector.addEventListener("onWebcamConnectSuccess", function () {
});

// Inform in console if fails
detector.addEventListener("onWebcamConnectFailure", function () {
  console.log("Webcam access denied");
});

// se notifica que se paro con el reconocimiento
detector.addEventListener("onStopSuccess", function () {
$("#results").html("");
});


// se sacan los resultados de la deteccion de la camara
detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
$('#results').html("");
  //log('#results', "Timestamp: " + timestamp.toFixed(2));
  //log('#results', "Number of faces found: " + faces.length);

  if (faces.length > 0) {
    var appearance = JSON.stringify(faces[0].appearance)
    var emotions = JSON.stringify(faces[0].emotions, function (key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    })
    var expressions = JSON.stringify(faces[0].expressions, function (key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    })
    var types = JSON.parse(emotions);
    log('#results', 'Alegria: '+ types.joy);
    log('#results', "Appearance: " + appearance);
    log('#results', "Expressions: " + expressions);
    log('#results', "Emotions: " + emotions);
    log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
    getMood(types)
    drawFeaturePoints(image, faces[0].featurePoints);
  }
});

//Dibuja los puntos de características faciales detectados en la imagen
function drawFeaturePoints(img, featurePoints) {
  var contxt = $('#face_video_canvas')[0].getContext('2d');
  var hRatio = contxt.canvas.width / img.width;
  var vRatio = contxt.canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);

  contxt.strokeStyle = "#FFFFFF";
  for (var id in featurePoints) {
    contxt.beginPath();
    contxt.arc(featurePoints[id].x,
      featurePoints[id].y, 2, 0, 2 * Math.PI);
    contxt.stroke();
  }
}

function getMood(types) {
  var joy = types.joy;
  var sadness = types.sadness;
  var disgust = types.disgust;
  var contempt = types.contempt;
  var anger = types.anger;
  var fear = types.fear;
  var surprise = types.surprise;

  var sum = (joy + sadness + disgust + contempt + anger + fear + surprise)
  var bademo = (sadness + disgust + anger) / 3
  var emotion;

  if (sum < 30) {
    emotion = "OK"
  }
  else {
    var happiness = joy - sadness - disgust - anger
    if (happiness > 0) {
      emotion = "Feliz"
    }
    else if ((fear > 20 || surprise > 20) && (bademo < fear || bademo < surprise)) {
      if (surprise - fear > 20)
        emotion = "Sorprendido"
      else if (surprise - fear < -20)
        emotion = "Asustado"
      else
        emotion = "Espantado"
    }
    else {
      var dislike = (disgust + contempt) / 2
      var rage = (anger + disgust) / 2
      if (sadness > rage) {
        if (sadness > dislike)
          emotion = "Triste"
        else if (contempt > disgust)
          emotion = "Despreciado"
        else
          emotion = "Disgustado"
      }
      else {
        if (rage > 95)
          emotion = "¡ Boooooooom !"
        else if (rage > 70)
          emotion = "Con rabia..."
        else
          emotion = "Enojado"
      }
    }
  }

  log('#results', "Humor: " + emotion);
}
