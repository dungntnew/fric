<?php

require_once CLASS_REALDIR . 'helper/SC_Helper_Purchase.php';
/**
 * 商品購入関連のヘルパークラス(拡張).
 *
 * LC_Helper_Purchase をカスタマイズする場合はこのクラスを編集する.
 *
 * @package Helper
 * @author Kentaro Ohkouchi
 * @version $Id$
 */

class plg_KEditPlugin_SC_Helper_Purchase extends SC_Helper_Purchase
{

	/**
     * 受注を完了する.
     *
     * 下記のフローで受注を完了する.
     *
     * 1. トランザクションを開始する
     * 2. カートの内容を検証する.
     * 3. 受注一時テーブルから受注データを読み込む
     * 4. ユーザーがログインしている場合はその他の発送先へ登録する
     * 5. 受注データを受注テーブルへ登録する
     * 6. トランザクションをコミットする
     *
     * 実行中に, 何らかのエラーが発生した場合, 処理を中止しエラーページへ遷移する
     *
     * 決済モジュールを使用する場合は対応状況を「決済処理中」に設定し,
     * 決済完了後「新規受付」に変更すること
     *
     * @param  integer $orderStatus 受注処理を完了する際に設定する対応状況
     * @return void
     */
    function completeOrder($orderStatus = ORDER_NEW)
    {
        $objQuery =& SC_Query_Ex::getSingletonInstance();
        $objSiteSession = new SC_SiteSession_Ex();
        $objCartSession = new SC_CartSession_Ex();
        $objCustomer = new SC_Customer_Ex();
        $customerId = $objCustomer->getValue('customer_id');

        $objQuery->begin();
        if (!$objSiteSession->isPrePage()) {
            SC_Utils_Ex::sfDispSiteError(PAGE_ERROR, $objSiteSession);
        }

        $uniqId = $objSiteSession->getUniqId();
        $this->verifyChangeCart($uniqId, $objCartSession);

        $orderTemp = $this->getOrderTemp($uniqId);

        $orderTemp['status'] = $orderStatus;
        $cartkey = $objCartSession->getKey();
        $order_id = $this->registerOrderComplete($orderTemp, $objCartSession, $cartkey);
        $isMultiple = SC_Helper_Purchase::isMultiple();
        $shippingTemp =& $this->getShippingTemp($isMultiple);
        foreach ($shippingTemp as $shippingId => $val) {
            $this->registerShipmentItem($order_id, $shippingId, $val['shipment_item']);
        }

        $this->registerShipping($order_id, $shippingTemp);

        // must call before cleanup session & before commit
        $this->onAfterInsertOrderHandler($order_id);

        $objQuery->commit();

        //会員情報の最終購入日、購入合計を更新
        if ($customerId > 0) {
            SC_Customer_Ex::updateOrderSummary($customerId);
        }

        // save cleanup session
        $this->cleanupSession($order_id, $objCartSession, $objCustomer, $cartkey);

        GC_Utils_Ex::gfPrintLog('order complete. order_id=' . $order_id);
    }

    function onAfterInsertOrderHandler($order_id) {
    
        $transaction_id = $_GET['transactionid'];
        $transaction_id = SC_Helper_Session_Ex::getToken();
        $objQuery =& SC_Query_Ex::getSingletonInstance();
        $order_details = $objQuery->select('*', 'dtb_order_detail as t1', 't1.order_id = ?',
            array($order_id));

        $msg = "id: $transaction_id";
        $msg .= " order: $order_id";
        $msg .= " length: ". count($order_details);

        $this->log($msg);

        $plg_kedit_flg = 0;

        foreach ($order_details as $order_detail) {

            $exported_templates = $objQuery->select('*', 'plg_keditplugin as t1', 't1.transaction_id = ? and t1.product_id = ?',
            array($transaction_id, $order_detail['product_id']));

            $this->log("template count: " . count($exported_templates));

            if (count($exported_templates) > 0) {
                $template_data = $exported_templates[0];
                
                $this->log("start update: " . $template_data['upload_picture_url']);

                $objQuery->update('dtb_order_detail', 
                       array('plg_kedit_user_picture_path' => $template_data['upload_picture_url'],
                             'plg_kedit_tpl_path' => $template_data['upload_template_url']),
                       'order_detail_id = ? and product_id = ?',
                       array($order_detail['order_detail_id'], $order_detail['product_id'])
               );
               $plg_kedit_flg = 1;
            }
        }
        $objQuery->update('dtb_order', 
               array('plg_kedit_flg' => $plg_kedit_flg),
               'order_id = ?',
               array($order_id)
       );
        // clear plg_keditplugin all record where transaction_id = ?
    }
    
    // log util using database. 
    // to use: create table log(msg TEXT);
    function log($msg) {
          $objQuery =& SC_Query_Ex::getSingletonInstance();
            $objQuery->insert('log', array('msg' => $msg));
        if (DB_LOG_ENABLE == 1) {
            $objQuery =& SC_Query_Ex::getSingletonInstance();
            $objQuery->insert('log', array('msg' => $msg));
        }
    }

}
