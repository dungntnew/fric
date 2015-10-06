<?php
/**
 * プラグイン の情報クラス.
 *
 * @package KEditPlugin
 * @author Dungntnew
 * @version $Id: $
 */
class plugin_info{
    /** プラグインコード(必須)：プラグインを識別する為キーで、他のプラグインと重複しない一意な値である必要がありま. */
    static $PLUGIN_CODE       = "KEditPlugin";
    /** プラグイン名(必須)：EC-CUBE上で表示されるプラグイン名. */
    static $PLUGIN_NAME       = "KEdit対象商品設定";
    /** クラス名(必須)：プラグインのクラス（拡張子は含まない） */
    static $CLASS_NAME        = "KEditPlugin";
    /** プラグインバージョン(必須)：プラグインのバージョン. */
    static $PLUGIN_VERSION    = "1.0.0";
    /** 対応バージョン(必須)：対応するEC-CUBEバージョン. */
    static $COMPLIANT_VERSION = "2.12, 2.13";
    /** 作者(必須)：プラグイン作者. */
    static $AUTHOR            = "Dungntnew";
    /** 説明(必須)：プラグインの説明. */
    static $DESCRIPTION       = "Edit Template App";
    /** プラグインURL：プラグイン毎に設定出来るURL（説明ページなど） */
    static $PLUGIN_SITE_URL   = "http://";
	static $AUTHOR_SITE_URL   = "http://";
	/** フックポイント **/
    static $HOOK_POINTS       = array(
			array('LC_Page_Admin_Products_Product_action_after', 'admin_products_product_after'),
            array("LC_Page_Products_Detail_action_after", 'front_products_detail_after'),
            array("LC_Page_Products_List_action_after", 'front_products_list_after'),
            array("LC_Page_Shopping_Confirm_Ex_action_begin", 'front_cart_begin'),
            array("LC_Page_Shopping_Confirm_Ex_action_after", 'front_cart_after'),
            array("LC_Page_Admin_Order_action_after", 'admin_order_after')        
	);
    /** ライセンス */
    static $LICENSE        = "LGPL";
}

/*
     PLEASE UPDATE PHP.INI FOR UPLOAD LIMIT 
     php.ini
     upload_max_filesize = 1000M;
     post_max_size = 1000M;
 */
?>
