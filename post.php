<?php
$myfile = fopen("code.txt", "r") or die("Unable to open file!");
$file_content = fread($myfile,filesize("code.txt"));

$data = explode(';', $file_content);
$data = str_replace('\n', '$', $data);
//var_dump(explode(';', $file_content));


//echo gettype($file_content);
/*
foreach($file_content as $line)
    echo $line.'<br>';*/



/*
fclose($myfile);
foreach($data as $d){
    var_dump($d);
}*/
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);
?>
