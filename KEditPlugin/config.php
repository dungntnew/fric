<?php

// {{{ requires
require_once PLUGIN_UPLOAD_REALDIR .  'KEditPlugin/LC_Page_Plugin_KEditPlugin_Config.php';

// }}}
// {{{ generate page
$objPage = new LC_Page_Plugin_KEditPlugin_Config();
register_shutdown_function(array($objPage, 'destroy'));
$objPage->init();
$objPage->process();
?>
