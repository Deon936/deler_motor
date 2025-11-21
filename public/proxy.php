<?php
// public/proxy.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$url = 'https://backend.infinityfree.me/backend/api/motorcycles.php?i=1';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

if ($response === false) {
    echo json_encode(['error' => 'Failed to fetch data from API']);
} else {
    echo $response;
}
?>