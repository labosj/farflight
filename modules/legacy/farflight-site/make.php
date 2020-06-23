#!/usr/bin/php
<?php
include('../ephp/ephp.php');

$ephp->inc(["theme", "data"]);
$ephp->init();
$ephp->get_abs_path();
$ephp->input_dir = "files";
$ephp->register('index.html.php');
$ephp->register('software/bosque.html.php');
$ephp->register('software/trebol.html.php');
$ephp->register('software/tundra.html.php');
$ephp->register('css/base.css.php');
$ephp->register('img/favicon.png');
$ephp->resize('img/imo-header-logo.png', 185, 100);
$ephp->resize('img/apple.png', 25, 25);
$ephp->resize('img/win.png', 25, 25);
$ephp->resize('img/any.svg', 25, 25);
$ephp->resize('img/mail.svg', 14, 14);
$ephp->resize('img/homepage.svg', 14, 14);
$ephp->resize('software/icon/bosque.svg', 64, 64);
$ephp->resize('software/icon/tundra-piechart.svg', 64, 64);
$ephp->resize('software/icon/trebol.svg', 64, 64);
$ephp->register('js/lib.js');
$ephp->end();
?>
