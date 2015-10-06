<?php
/**
 * 共通関数
 *
 * @package KEditPlugin
 * @author Dungntnew
 * @version $Id: $
 */
class plg_KEditPlugin_Util {
	function getECCUBEVer(){
		return floor(str_replace('.','',ECCUBE_VERSION));
	}
	
	function getConfig($col){
		if($col == "method")$col = "free_field1";
		$objQuery =& SC_Query_Ex::getSingletonInstance();
		return $objQuery->get($col,"dtb_plugin","plugin_code = ?",array('KEditPlugin'));
	}
}