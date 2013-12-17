<?php

require_once 'vendor/autoload.php';

use Ilpaijin\Math;

$a = array('A' => array(1,2,3,8,9));
$b = array('B' => array(2,5,9,10,12,14));
$c = array('C' => array("Boys", "Girls", "Zend", "Barcelona", "Come 'on"));
$d = array('D' => array("Jurgen", "Berlusconi", "Paté di pato", "Frio", "Boys", "Zend"));

$ab = new Math($a, $b);
$abDiff = $ab->setDifference();

$ba = new Math($b, $a);
$baDiff = $ba->setDifference();

$cd = new Math($c, $d);
$cdDiff = $cd->setDifference();

$dc = new Math($d, $c);
$dcDiff = $dc->setDifference();

echo $result = json_encode(array($abDiff, $baDiff, $cdDiff, $dcDiff));

