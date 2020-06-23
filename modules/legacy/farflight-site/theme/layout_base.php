<?
include_once('common/meta_basic.php');
include_once('common/meta_twitter_card.php');
include_once('common/meta_open_graph.php');
include_once('common/widget_google_analytics.php');

class LayoutBase {
  
  
  public static function html_start() {
ob_start();?>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title><?=$title?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?meta_basic($title, $GLOBALS['description'], null, null, null);?>
  <?meta_twitter_card($title, $GLOBALS['description'], "imoinf", "image");?>
  <?meta_open_graph($title, site_url('/'), $GLOBALS['description'], null);?>
  <?include_js(site_url('/js/lib.js'))?> 
  <?include_css(site_url('/css/base.css'))?>
  <?include_favicon('image/png',site_url('/img/favicon.png'))?>  
</head>
<body>
<? echo ob_get_clean();
  }

  public static function html_end() {
ob_start(); ?>
<?widget_google_analytics($GLOBALS['site']['google_tracking_id'])?>
</body>
<? echo ob_get_clean();
  }
}

