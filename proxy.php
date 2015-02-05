<?php

$page = isset($_GET['page']) ? $_GET['page'] : '/Mainpage';
if ('/' == $page) $page = '/Mainpage';

$page_title = substr($page, 1);
$page_hash = urlencode($page_title);
$cache_file = './cache/' . $page_hash;

if (!file_exists($cache_file)) {
	$url = 'http://zh.moegirl.org' . $page . '?action=render';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Moegirl proxy alpha');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$content = curl_exec($ch);
	curl_close($ch);

	$content .= '<meta id="moegirl-proxy-data" data-timestamp="' . time() . '" data-url="' . htmlentities('http://zh.moegirl.org' . $page) . '" data-title="' . htmlentities($page_title) . '" />';
	file_put_contents($cache_file, $content);
} else {
	$content = file_get_contents($cache_file);
}

if (!isset($_SERVER['HTTP_X_PJAX'])) {
	$template = file_get_contents('./index.html');
	$content = str_replace('<!-- #moegirl-content -->', $content, $template);
}

echo $content;
