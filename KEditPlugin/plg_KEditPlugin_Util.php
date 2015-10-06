<?php
/**
 * 共通関数
 *
 * @package KEditPlugin
 * @author Dungntnew
 * @version $Id: $
 */
define("KEDIT_DEV_MODEL", true);
class plg_KEditPlugin_Util {
	function getECCUBEVer(){
		return floor(str_replace('.','',ECCUBE_VERSION));
	}
	
	function getConfig($col){
		if($col == "method")$col = "free_field1";
		$objQuery =& SC_Query_Ex::getSingletonInstance();
		return $objQuery->get($col,"dtb_plugin","plugin_code = ?",array('KEditPlugin'));
	}
	    
    // log util using database. 
    // to use: create table log(msg TEXT);
    function log($msg) {
        if (KEDIT_DEV_MODEL) {
            $objQuery =& SC_Query_Ex::getSingletonInstance();
            $objQuery->insert('plg_kedit_log', array('msg' => $msg));
        }
    }
}