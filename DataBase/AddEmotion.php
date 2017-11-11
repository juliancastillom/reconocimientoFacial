<?php

// Este programa se conecta a la base de datos e introduce el valor correspondiente.

include ("conexion.php");

$mysqli = new mysqli($host, $user, $pw, $db);
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
} 

$idEmocion = $_GET['idEmocion'];
$idUser = $_GET['idUser'];
$idVideo = $_GET['idVideo'];
$categoria = $_GET['categoria'];
$emocion = $_GET['emocion'];
echo $idEmocion;
echo $idUser;
echo $idVideo;
echo $categoria;
echo $emocion;
$sql = "INSERT INTO emociones(idEmocion,idUser,idVideo,categoria,emocion) VALUES ('$idEmocion','$idUser','$idVideo','$categoria','$emocion')";

if ($mysqli->query($sql) === TRUE) {
    echo "Se introdujo el valor correctamente";
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}

$mysqli->close();

?>