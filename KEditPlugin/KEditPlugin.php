<?php
require_once PLUGIN_UPLOAD_REALDIR . "KEditPlugin/plg_KEditPlugin_Util.php";

/**
 * プラグインのメインクラス
 *
 * @package KEditPlugin
 * @author Dungntnew
 * @version $Id: $
 */
define("KEDIT_NO_CACHE", true);
define('KEDIT_UPLOAD_DATA_API', HTTP_URL . "products/detail.php?kedit_app_subbmit=true");
define('KEDIT_PRODUCT_LIST_API', HTTP_URL . "products/list.php?kedit_app_fetch_product=true");

class KEditPlugin extends SC_Plugin_Base {

    /**
     * コンストラクタ
     */
    public function __construct(array $arrSelfInfo) {
        parent::__construct($arrSelfInfo);
    }
    
    /**
     * インストール
     * installはプラグインのインストール時に実行されます.
     * 引数にはdtb_pluginのプラグイン情報が渡されます.
     *
     * @param array $arrPlugin plugin_infoを元にDBに登録されたプラグイン情報(dtb_plugin)
     * @return void
     */
    function install($arrPlugin) {
		$objQuery =& SC_Query_Ex::getSingletonInstance();

        if (KEDIT_DEV_MODEL) {
            $objQuery->query("CREATE TABLE plg_kedit_log (msg TEXT, create_date timestamp, update_date TIMESTAMP)");
        }
        $objQuery->query("CREATE TABLE plg_keditplugin (transaction_id VARCHAR(255),product_id INT, upload_picture_url VARCHAR(255), upload_template_url VARCHAR(255), create_date timestamp, update_date TIMESTAMP)");

        $objQuery->query("ALTER TABLE dtb_products ADD COLUMN plg_kedit_flg smallint DEFAULT 0");
        $objQuery->query("ALTER TABLE dtb_order ADD COLUMN plg_kedit_flg smallint DEFAULT 0");
        $objQuery->query("ALTER TABLE dtb_order_detail ADD COLUMN plg_kedit_json_path varchar(256)");
        $objQuery->query("ALTER TABLE dtb_order_detail ADD COLUMN plg_kedit_tpl_path varchar(256)");
        $objQuery->query("ALTER TABLE dtb_order_detail ADD COLUMN plg_kedit_user_picture_path varchar(256)");


        
        

        // ロゴファイルをhtmlディレクトリにコピーします.
        copy(PLUGIN_UPLOAD_REALDIR . $arrPlugin['plugin_code'] . "/logo.png", PLUGIN_HTML_REALDIR . $arrPlugin['plugin_code'] . "/logo.png");

        mkdir(PLUGIN_HTML_REALDIR . $arrPlugin['plugin_code'] . "/www");
        SC_Utils_Ex::sfCopyDir(PLUGIN_UPLOAD_REALDIR . $arrPlugin['plugin_code']."/www/", PLUGIN_HTML_REALDIR . $arrPlugin['plugin_code']."/www/");
    }
    
    /**
     * アンインストール
     * uninstallはアンインストール時に実行されます.
     * 引数にはdtb_pluginのプラグイン情報が渡されます.
     * 
     * @param array $arrPlugin プラグイン情報の連想配列(dtb_plugin)
     * @return void
     */
    function uninstall($arrPlugin) {
		//テーブル削除
		$objQuery = SC_Query_Ex::getSingletonInstance();
        $objQuery->query("DROP TABLE IF EXISTS plg_kedit_log");
       $objQuery->query("DROP TABLE IF EXISTS plg_keditplugin");
        $objQuery->query("ALTER TABLE dtb_products DROP COLUMN plg_kedit_flg");
        $objQuery->query("ALTER TABLE dtb_order DROP COLUMN plg_kedit_flg");
        $objQuery->query("ALTER TABLE dtb_order_detail DROP COLUMN plg_kedit_json_path");
        $objQuery->query("ALTER TABLE dtb_order_detail DROP COLUMN plg_kedit_tpl_path");
        $objQuery->query("ALTER TABLE dtb_order_detail DROP COLUMN plg_kedit_user_picture_path");
    }
    
    /**
     * 稼働
     * enableはプラグインを有効にした際に実行されます. 
     * 引数にはdtb_pluginのプラグイン情報が渡されます.
     *
     * @param array $arrPlugin プラグイン情報の連想配列(dtb_plugin)
     * @return void
     */
    function enable($arrPlugin) {
    }

    /**
     * 停止
     * disableはプラグインを無効にした際に実行されます.
     * 引数にはdtb_pluginのプラグイン情報が渡されます.
     *
     * @param array $arrPlugin プラグイン情報の連想配列(dtb_plugin)
     * @return void
     */
    function disable($arrPlugin) {
    }

    /**
     * 処理の介入箇所とコールバック関数を設定
     * registerはプラグインインスタンス生成時に実行されます
     * 
     * @param SC_Helper_Plugin $objHelperPlugin 
     */
    function register(SC_Helper_Plugin $objHelperPlugin) {
        $objHelperPlugin->addAction("loadClassFileChange", array(&$this, "loadClassFileChange"), $this->arrSelfInfo['priority']);

		$objHelperPlugin->addAction("prefilterTransform",array(&$this,"prefilterTransform"),$this->arrSelfInfo['priority']);
		$objHelperPlugin->addAction("SC_FormParam_construct",array(&$this,"addParam"),$this->arrSelfInfo['priority']);


        $objHelperPlugin->addAction("LC_Page_Admin_Products_Product_action_after",array(&$this,"admin_products_product_after"),$this->arrSelfInfo['priority']);

        $objHelperPlugin->addAction("LC_Page_Products_Detail_action_after",array(&$this,"front_products_detail_after"),$this->arrSelfInfo['priority']);

        $objHelperPlugin->addAction("LC_Page_Products_List_action_after",array(&$this,"front_products_list_after"),$this->arrSelfInfo['priority']);

        

        $objHelperPlugin->addAction("LC_Page_Admin_Order_action_after",array(&$this,"admin_order_after"),$this->arrSelfInfo['priority']);
    }

	
    function prefilterTransform(&$source, LC_Page_Ex $objPage, $filename) {
        $objTransform = new SC_Helper_Transform($source);
		$template_dir = PLUGIN_UPLOAD_REALDIR . "KEditPlugin/templates/";
        switch($objPage->arrPageLayout['device_type_id']) {
			case DEVICE_TYPE_PC:
                if (strpos($filename, 'products/detail.tpl') !== false) {
                    
                    $template_dir = PLUGIN_UPLOAD_REALDIR . $this->arrSelfInfo['plugin_code'] . '/templates/';
                    $objTransform->select('.normal_price')->insertBefore(file_get_contents($template_dir . 'default/product_detail_kedit_btn_add.tpl'));

                    $objTransform->select('.normal_price')->insertBefore(file_get_contents($template_dir . 'product_detail_kedit_app_content.tpl'));
                }

                if (strpos($filename, 'frontparts/cart.tpl') !== false) {
                    $template_dir = PLUGIN_UPLOAD_REALDIR . $this->arrSelfInfo['plugin_code'] . '/templates/';
                    $objTransform->select('.item')->insertBefore("<h1>Hack Part-Cart</h1>");
                }

                break;
			case DEVICE_TYPE_SMARTPHONE:
                if (strpos($filename, 'products/detail.tpl') !== false) {
                    
                    $template_dir = PLUGIN_UPLOAD_REALDIR . $this->arrSelfInfo['plugin_code'] . '/templates/';
                    $objTransform->select('.btn_favorite')->insertBefore(file_get_contents($template_dir . 'default/product_detail_kedit_btn_add.tpl'));

                    $objTransform->select('#product_detail')->insertBefore(file_get_contents($template_dir . 'product_detail_kedit_app_content.tpl'));
                }

                if (strpos($filename, 'frontparts/cart.tpl') !== false) {
                    $template_dir = PLUGIN_UPLOAD_REALDIR . $this->arrSelfInfo['plugin_code'] . '/templates/';
                    $objTransform->select('.item')->insertBefore("<h1>Hack Part-Cart</h1>");
                }
                break;           
			case DEVICE_TYPE_MOBILE:
				break;		
            // 端末種別：管理画面
            case DEVICE_TYPE_ADMIN:
			default:
				$template_dir .= "admin/";
                // 受注管理・編集画面
                if(strpos($filename, "products/product.tpl") !== false) {
					if(plg_KEditPlugin_Util::getECCUBEVer() >= 2130){
                    	$objTransform->select("table.form tr",14)->insertAfter(file_get_contents($template_dir ."products/product.tpl"));
					}else{
                    	$objTransform->select("table.form tr",13)->insertAfter(file_get_contents($template_dir ."products/product.tpl"));
					}
				}
                if(strpos($filename, "products/confirm.tpl") !== false) {
					if(plg_KEditPlugin_Util::getECCUBEVer() >= 2130){
                    	$objTransform->select("div.contents-main table tr",12)->insertAfter(file_get_contents($template_dir ."products/confirm.tpl"));
					}else{
						$objTransform->select("div.contents-main table tr",11)->insertAfter(file_get_contents($template_dir ."products/confirm.tpl"));
					}
				}		
                if(strpos($filename, "order/index.tpl") !== false) {
                    if(plg_KEditPlugin_Util::getECCUBEVer() >= 2130){
                        $objTransform->select("form#form1 table.list")->replaceElement(file_get_contents($template_dir ."order/list.tpl"));
                    }else{
                        $objTransform->select("form#form1 table.list")->replaceElement(file_get_contents($template_dir ."order/list.tpl"));
                    }
                }   
                break;
        }
        $source = $objTransform->getHTML();
    }
	
	function addParam($class_name,$param){
		if(strpos($class_name,'LC_Page_Admin_Products_Product') !== false){
			$this->addKEditPluginParam($param);
		}
	}
	
	function loadClassFileChange(&$classname,&$classpath){
		if($classname == 'SC_Helper_Purchase_Ex'){
			$classpath = PLUGIN_UPLOAD_REALDIR . "KEditPlugin/plg_KEditPlugin_SC_Helper_Purchase.php";
			$classname = "plg_KEditPlugin_SC_Helper_Purchase";
		}
	}
	
    /**
     * @param LC_Page_Admin_Products_Product $objPage 商品管理のページクラス
     * @return void
     */
    function admin_products_product_after($objPage) {
		$objFormParam = new SC_FormParam_Ex();
        switch($objPage->getMode($objPage)) {
            case "pre_edit":
            case "copy" :
                // 何もしない
                break;
            case "edit":
            case "upload_image":
            case "delete_image":
            case "upload_down":
            case "delete_down":
            case "recommend_select":
            case "confirm_return":
				$this->addKEditPluginParam($objFormParam);
                $objPage->lfInitFormParam($objFormParam, $_POST);
				$arrForm = $objFormParam->getHashArray();
                $objPage->arrForm['plg_kedit_flg'] = $arrForm['plg_kedit_flg'];
                break;
            case "complete":
                $objQuery =& SC_Query_Ex::getSingletonInstance();
                $table = "dtb_products";
                $where = "product_id = ?";
                $arrParam['plg_kedit_flg'] = $_POST['plg_kedit_flg'];
                $arrParam['update_date'] = "CURRENT_TIMESTAMP";
                $arrWhere[] = $objPage->arrForm['product_id'];
                $objQuery->update($table, $arrParam, $where, $arrWhere);
                break;
            default:
                break;
        }
    }

     /**
     * LC_Page_Products_Detail_action_after hookpoint
     * 
     * Modifies the template
     * @param LC_Page_Ex $objPage Page object
     * 
     */
    function front_products_detail_after($objPage) {
        if ($_POST['kedit_summit']) {
            try {
                $transactionid = $_POST['transactionid'];
                $product_id = $_POST['kedit_product_id'];
                $template_url = $_POST['kedit_template_url'];
                $encoded_data = $_POST['kedit_exported_data_url'];
                $encoded_data = urldecode($encoded_data);
                $uniqid = SC_Utils_Ex::sfGetUniqRandomId('r');
                $filename = "kedit_$transactionid";
                $filename .= "_" . $uniqid . "_".$product_id . ".png";
                $write_path = IMAGE_SAVE_REALDIR . $filename;
                $public_path = IMAGE_SAVE_RSS_URL . $filename;
                $this->saveImage($encoded_data, $write_path);
                $this->saveImageToDB($transactionid, $product_id, $filename, $template_url);

                $response = array(
                    'success' => true,
                    'url' => urlencode($public_path)
                );
                echo SC_Utils_Ex::jsonEncode($response);
                exit;

            } catch (Exception $e) {
                $response = array(
                    'success' => false,
                    'url' => '',
                    'err' => $e->getMessage()
                );
                echo SC_Utils_Ex::jsonEncode($response);
                exit;
            }
            return;
        }

        $media_path = PLUGIN_HTML_URLPATH . $this->arrSelfInfo['plugin_code'] . "/www/";
        
        $objPage->ui_start_btn =  $media_path . "img/btn/kedit_start_btn.jpg";
        $index_file = KEDIT_NO_CACHE ? "index.php": "index.html";
        $objPage->app_path = $media_path . $index_file;
        $objPage->upload_api = KEDIT_UPLOAD_DATA_API;
        $objPage->product_list_api = KEDIT_PRODUCT_LIST_API;
        $objPage->media_path = $media_path;
    }

     /**
     * LC_Page_Products_List_action_after hookpoint
     * 
     * Modifies the template
     * @param LC_Page_Ex $objPage Page object
     * 
     */
    function front_products_list_after($objPage) {
        if ($_GET['kedit_app_fetch_product']) {
            $products = $this->fetchProducts();
            $response = array(
                'success' => true,
                'image_path' => IMAGE_SAVE_RSS_URL,
                'products' => json_encode($products)
            );
            echo SC_Utils_Ex::jsonEncode($response);
            exit;
            return;
        }
    }

    

     /**
     * LC_Page_Admin_Order_action_after hookpoint
     * 
     * Modifies the template
     * @param LC_Page_Ex $objPage Page object
     * 
     */
    function admin_order_after($objPage) {
        if ($_POST['kedit_summit']) {

            $order_id = $_POST['order_id'];
            
            $arrProducts = $this->fetchOrderDetail($order_id);
             $response = array(
                'success' => true,
                'products' => $arrProducts
            );
            echo SC_Utils_Ex::jsonEncode($response);
            exit;
        }
    }

    function fetchOrderDetail($order_id) {
        $objQuery =& SC_Query_Ex::getSingletonInstance();
        $objQuery->setLimitOffset(10, 0);

        $arrProducts = $objQuery->select('t1.*, t2.plg_kedit_flg', 'dtb_order_detail as t1 join dtb_products as t2 on t1.product_id = t2.product_id', 't1.order_id = ?', array($order_id));
        return $arrProducts;
    }

	
	function addKEditPluginParam(&$objFormParam){
		$objFormParam->addParam("KEdit対象設定", 'plg_kedit_flg', INT_LEN, 'n', array('NUM_CHECK','MAX_LENGTH_CHECK'));
	}

    function fetchProducts(){

        $objQuery =& SC_Query_Ex::getSingletonInstance();
        $objQuery->setLimitOffset(10, 0);
        $arrProducts = $objQuery->select('product_id as id, name as name, main_comment as detail, main_image as template, main_list_image as thumbnail', 'dtb_products as t1', 't1.del_flg = ? and t1.status = ? and t1.plg_kedit_flg = ?',
            array('0', '1', '1'));
        
        foreach($arrProducts as $key => $val) {
            $arrProducts[$key]['thumbnail'] = SC_Utils_Ex::sfNoImageMainList($val['thumbnail']);
            $arrProducts[$key]['template'] = SC_Utils_Ex::sfNoImageMain($val['template']);
        }
        return $arrProducts;
    }

    function saveImage($base64img, $write_path){
        $base64img = str_replace("data:image/png;base64,", '', $base64img);
        $data = base64_decode($base64img);
        file_put_contents($write_path, $data);
    }

    function saveImageToDB($transactionid, $product_id, $picture, $template) {
        $objQuery = SC_Query::getSingletonInstance();

        $images = $objQuery->select('*', 'plg_keditplugin as t1', 't1.transaction_id = ? and t1.product_id = ?',
            array($transactionid, $product_id));
        
        if (count($images) > 0) {
            $objQuery->update('plg_keditplugin', 
                   array('upload_picture_url' => $picture,
                         'upload_template_url' => $template)
           );
        }
        else {
            $objQuery->insert('plg_keditplugin', 
                   array('transaction_id' => $transactionid,
                         'product_id' => $product_id,
                         'upload_picture_url' => $picture,
                         'upload_template_url' => $template)
           );
        }
    }
}
?>
