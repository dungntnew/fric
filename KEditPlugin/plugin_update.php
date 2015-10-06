<?php
 
/**
 *
 * @package KEditPlugin
 * @author Dungntnew
 * @version $Id: $
 */
class plugin_update {
    /**
     * アップデート
     * updateはアップデート時に実行されます.
     * 引数にはdtb_pluginのプラグイン情報が渡されます.
     *
     * @param array $arrPlugin プラグイン情報の連想配列(dtb_plugin)
     * @return void
     */
    function update($arrPlugin) {
		
		$plugin_dir_path = PLUGIN_UPLOAD_REALDIR . $arrPlugin['plugin_code'] . '/';
		SC_Utils_Ex::copyDirectory(DOWNLOADS_TEMP_PLUGIN_UPDATE_DIR, $plugin_dir_path);
		
		$objQuery =& SC_Query_Ex::getSingletonInstance();
		$objQuery->begin();
		
        $sqlval_plugin = array();
        $sqlval_plugin['plugin_version'] = "1.0.0";
        $sqlval_plugin['update_date'] = 'CURRENT_TIMESTAMP';
		
		$flg = $objQuery->get("free_field1","dtb_plugin","plugin_code = ?",array($arrPlugin['plugin_code']));
		if(is_null($flg) || $flg =="")$objQuery->update("dtb_plugin", array("free_field1" => '0'),"plugin_code = ?",array($arrPlugin['plugin_code']));
	
		$objQuery->update('dtb_plugin', $sqlval_plugin, "plugin_code = ?", array($arrPlugin['plugin_code']));
		
		$objQuery->commit();
    }
}
?>
