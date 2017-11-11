var divRoot = $("#affdex_elements")[0];
var width = 280;
var height = 220;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

var aburrido = 0;
var feliz = 0;
var sorprendido = 0;
var neutro = 0;
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
    //log('#results', 'Alegria: '+ types.joy);
    //log('#results', "Appearance: " + appearance);
    //log('#results', "Expressions: " + expressions);
    log('#results', "Emotions: " + emotions);
    //log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
    //getMood2(types)
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

  
  
  var emotion;
  
  //Se inicializan las variables que se tendrán en cuenta para definir las emociones
  
  var suma = (joy + sadness + disgust + contempt + anger + fear + surprise)
  var felicidad = joy - sadness - disgust - anger
  var promedio1 = (suma - surprise) / 6
  var promedio2 = (suma - fear) / 6
  var promedio3 = (suma - disgust) / 6
  var promedio4 = (suma - sadness) / 6
  var promedio5 = (suma - anger) / 6
  var promedio6 = (suma - contempt) / 6

  if (suma < 8) {
    emotion = "Neutro";
	neutro = neutro + 1;
  }
   
  else if (felicidad > 0){
	  emotion = "Feliz";
	  feliz = feliz + 1;
  }	
  
  else if ((surprise > promedio1) || (fear > promedio2)){
	  emotion = "Sorprendido"
	  sorprendido = sorprendido + 1;
  }
  
  else if ((disgust > promedio3) || (sadness > promedio4) || (anger > promedio5)||(contempt > promedio6)){
	  emotion = "Aburrido"
	  aburrido = aburrido + 1;
  }
  

  log('#results', "Humor: " + emotion);
  //Se envia la emocion por ajax a un archivo en php el cual realiza un INSERT en la base de datos
  Consulta();
}


//Envio datos
function Consulta(){
//-----------------------------------------------------------------------
// 2) Send a http request with AJAX http://api.jquery.com/jQuery.ajax/
//-----------------------------------------------------------------------
	var emocionMax = 0;
	var idEmocion = 0;
	var idUser = 0;
	var idVideo = 0;
	var categoria = "Matematicas";
	var emocion = 0;
	if (aburrido > emocionMax)
	{
		emocionMax = aburrido;
		emocion = "aburrido";
	}
	
	if (feliz > emocionMax)
	{
		emocionMax = feliz;
		emocion = "feliz";
	}
	if (sorprendido > emocionMax)
	{
		emocionMax = sorprendido;
		emocion = "sorprendido";
	}
	if (neutro > emocionMax)
	{
		emocionMax = neutro;
		emocion = "neutro";
	}
	/* log('#results', "idEmocion: " + idEmocion+" prueba1");
	log('#results', "idUser: " + idUser);
	log('#results', "idVideo: " + idVideo);	
	log('#results', "categoria: " + categoria);*/
	log('#results', "emocion: " + emocion); 
	log('#results', "Aburrido: " + aburrido);
	log('#results', "Feliz: " + feliz);
	log('#results', "Sorprendido: " + sorprendido);
	log('#results', "Neutro: " + neutro);
	//http://localhost/AffectivaDemo/DataBase/AddEmotion.php?idEmocion=4&idUser=3&idVideo=2&categoria=categoria&emocion=emocion
//alert(emotion);
  /*$.ajax({
      url: 'http://localhost/AffectivaDemoV2/DataBase/AddEmotion.php?idEmocion='+idEmocion+'&idUser='+ idUser+',&idVideo='+idVideo+',&categoria='+categoria+'&emocion='+emocion,
	  //http://localhost/main.php?email=$email_address&event_id=$event_id,
      type: 'post',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
	  //data: {"idEmocion:"+idEmocion+",idUser:"+ idUser+",idVideo:"+idVideo+",categoria:"+categoria+",emocion:"+emocion},
	  data: {idEmocion,idUser,idVideo,categoria,emocion},
	  complete: function (rData) {
          //alert("Data: " + rData.toString());
      }
  });
*/
}

/* function getMood2() {
	numero=Math.floor((Math.random() * 4) + 1);
	//log('#results', "Numero: " + numero);
	if (numero == 1)
	{
		aburrido = aburrido + 1;	
	}
	else if (numero == 2){
		feliz = feliz + 1;
		
	}
	else if (numero == 3){
		sorprendido = sorprendido + 1;
	}
	else if (numero == 4)
	{
		neutro = neutro + 1;		
	}
	//log('#results', "Aburrido: " + aburrido);
	//log('#results', "Feliz: " + feliz);
	//log('#results', "Sorprendido: " + sorprendido);
	//log('#results', "Neutro: " + neutro);
} */
