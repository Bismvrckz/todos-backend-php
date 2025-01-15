<?php
session_start();
header("Content-Type: image/png");
$text = rand(10000,99999);
$_SESSION["securechapct"] = $text;
$height = 20;
$width = 65;

$image_p = imagecreate($width, $height);
$black = imagecolorallocate($image_p, 238, 238, 238);
$white = imagecolorallocate($image_p, 0, 0, 0);
$font_size = 10;

imagestring($image_p, $font_size, 5, 3, $text, $white);
imagejpeg($image_p, null, 80);

?>