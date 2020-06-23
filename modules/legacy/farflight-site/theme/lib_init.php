<?
include('common/lib_base.php');
include('config.php');

function lib_get_var($name) {
  global $page;
  global $site;
  if ( isset($page[$name]) ) $GLOBALS[$name] = $page[$name];
  else if ( isset($site[$name]) ) $GLOBALS[$name] = $site[$name];
}

lib_get_var('title');
lib_get_var('description');
lib_get_var('tagline');
lib_get_var('image');


?>
