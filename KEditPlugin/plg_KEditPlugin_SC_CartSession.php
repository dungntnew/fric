<?php

require_once CLASS_REALDIR . 'SC_CartSession.php';


class plg_KEditPlugin_SC_CartSession extends SC_CartSession
{
	/**
	 * 全てのカートの内容を取得する.
	 *
	 * @return array 全てのカートの内容
	 */
	public function getAllCartList()
	{
		$results = array();
		$cartKeys = $this->getKeys();
		$i = 0;
		foreach ($cartKeys as $key) {

			$cartItems = $this->getCartList($key);
			foreach ($cartItems as $itemKey => $itemValue) {
				$cartItem =& $cartItems[$itemKey];
				$product_id = $cartItem['productsClass']['product_class_id'];
				$main_list_image = $cartItem['productsClass']['main_list_image'];
				$plg_kedit_flg = $cartItem['productsClass']['plg_kedit_flg'];
				$uploaded_url = $this->loadSavedImage($product_id);
				if (strlen($uploaded_url) > 0 && $plg_kedit_flg){
					$cartItem['productsClass']['main_list_image'] = $uploaded_url;
				}

				$results[$key][$i] =& $cartItem;
				$i++;
			}
		}

		return $results;
	}

	/*
	   load uploaded image from database with current session
	 */
	function loadSavedImage($product_id) {
		$transaction_id = SC_Helper_Session_Ex::getToken();
		$objQuery = SC_Query::getSingletonInstance();

		$urls = $objQuery->select('preview_picture_url', 'plg_keditplugin as t1', 't1.transaction_id = ? and t1.product_id = ? limit 1',
			array($transaction_id, $product_id));
		if (count($urls) > 0) {
			return $urls[0]['preview_picture_url'];
		}else {
			return '';
		}
	}
}