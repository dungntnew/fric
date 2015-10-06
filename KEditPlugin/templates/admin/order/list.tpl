<style>
   #cboxLoadedContent {
       background-color: white;
   }
   /* Outer */
.order-detail-popup {
    width:100%;
    height:100%;
    display:none;
    position:fixed;
    top:0px;
    left:0px;
    background:rgba(0,0,0,0.75);
}
 
/* Inner */
.popup-inner {
    max-width:700px;
    width:90%;
    padding:40px;
    position:absolute;
    top:50%;
    left:50%;
    -webkit-transform:translate(-50%, -50%);
    transform:translate(-50%, -50%);
    box-shadow:0px 2px 6px rgba(0,0,0,1);
    border-radius:3px;
    background:#fff;
}
 
/* Close Button */
.popup-close {
    width:30px;
    height:30px;
    padding-top:4px;
    display:inline-block;
    position:absolute;
    top:0px;
    right:0px;
    transition:ease 0.25s all;
    -webkit-transform:translate(50%, -50%);
    transform:translate(50%, -50%);
    border-radius:1000px;
    background:rgba(0,0,0,0.8);
    font-family:Arial, Sans-Serif;
    font-size:20px;
    text-align:center;
    line-height:100%;
    color:#fff;
}
 
.popup-close:hover {
    -webkit-transform:translate(50%, -50%) rotate(180deg);
    transform:translate(50%, -50%) rotate(180deg);
    background:rgba(0,0,0,1);
    text-decoration:none;
}
@keyframes twinkly {
    0% {opacity: 0.4;}
    100% {opacity: 1;}
}

.twinkle {
    animation: twinkly 1s alternate infinite;
}

.pdfLink {
    background-color: white;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    display: block;
    height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 1px solid #FFC31B;
}
.pdfLink a {
    font-size: 14px;
}
.exportStatus * {
    font-size: 14px;
}
.exportStatus .error {
    color: red;
}

.exportStatus .error_detail {
    background-color: #b4b4b4;
    text-align: center;
    line-height: 40px;
    text-decoration: italic;
    font-size: 12px;
    display: block;
    height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 1px solid black;
}
.exportStatus .success {
    color: blue;
}

</style>


<h2>TEST product detail </h2>
<p><a class='ex_link' href="#">Example with alerts</a>.

<div class="order-detail-popup" data-popup="popup-1">
    <div class="popup-inner">
            <div class="orderDetails">
            <table class="list">
                <col width="10%" />
                <col width="15%" />
                <col width="60%" />
                <col width="15%" />
                <tr>
                    <th>商品番号</th>
                    <th>KEdit対象</th>
                    <th>商品名</th>
                    <th>PDF</th>
                </tr>
            </table>
            </div>
            <div class="exportStatus"> </div>
            <div class="pdfLink"> </div>
        <a data-popup-close="popup-1" href="#">Close</a></p>
        <a class="popup-close" data-popup-close="popup-1" href="#">x</a>
    </div>
</div>



<script type="text/javascript">//<![CDATA[
    $(document).ready(function(){
        $(".ex_link").click(function(){
            showOrderDetail(15);
        });

        //----- CLOSE
        $('[data-popup-close]').on('click', function(e)  {
            var targeted_popup_class = jQuery(this).attr('data-popup-close');
            $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
            e.preventDefault();
        });

    });
    function isKeditEnable(product) {
       
        return (product['plg_kedit_flg'] === "1" 
               && product['plg_kedit_tpl_path'] 
               && product['plg_kedit_user_picture_path']);
    } 

    function showOrderDetail(orderId) {
         var handleLoadOrderFail = function(error) {
            alert("Cannot load order detail for order id: " + orderId);
         };

         var showTable = function(products) {
            var table = $(".orderDetails > table")[0];
            $('table tr.dynamic').remove();
            $('.exportStatus').html("").fadeOut();
            $('.pdfLink').fadeOut();

            products.forEach(function(product) {
                var kedit_flg = isKeditEnable(product);
                if (kedit_flg) {
                    var pdfBtn = $('<a></a>')
                                 .attr('href', '#')
                                 .attr('data', product['order_detail_id'])
                                 .text(product['plg_kedit_flg'] == 1 ? '表示' : '--');
                    if (product['plg_kedit_flg'] == 1) {
                        $(pdfBtn).click(function(){
                           generatePdf($(this).attr('data'));
                       });
                    }
                }else {
                    var pdfBtn = '<span>--</span>';
                }

 


                row = $('<tr></tr>').addClass('dynamic');
                $(row).append($('<td></td>').addClass('center').text(product['product_id']));
                $(row).append($('<td></td>').addClass('center').text(kedit_flg ? '有' : '無'));
                $(row).append($('<td></td>').addClass('center').text(product['product_name']));
                $(row).append($('<td></td>').addClass('center').html(pdfBtn));
                $(table).append(row);
            });
            $('.order-detail-popup').fadeIn(350);

         }

        $.ajax({
            type: "POST",
            ulr: "admin/order/index.php",
            data: { 
                'transactionid': $("*[name=transactionid]").val(), 
                'order_id': orderId,
                'kedit_summit': true 
            },
            success: function(data){
                var response = JSON.parse(data);
                var products = response['products'];

                if (!response['success']) {
                    handleLoadOrderFail();
                    return;
                }

                products.forEach(function(product){
                    console.log(product.product_id);
                });
                showTable(products);
            },
            error: function(xhr,status,error) {
                console.log(error);
                handleLoadOrderFail(error);
            }
        });
    }

    function generatePdf(order_detail_id) {
        var message = "<span>少々お待ちください。。ただいいまデータ書き出し中。。</span>";
        $('.pdfLink').fadeOut();
        $('.exportStatus').html(message).fadeIn(500);

        var port = 3000;
        var protocol = window.location.protocol;
        var hostname = window.location.hostname;
        var api_host = protocol + '//' + hostname + ':' + port;
        var api_path = api_host + '/api/export/';
        var request_url = api_path +  order_detail_id;
        
        var handleError = function(error) {
            $('.exportStatus').html('');
            $('.exportStatus').fadeOut(100);
            $('.exportStatus').append('<p class="error">書き出し失敗した</p></br>');
            $('.exportStatus').append('<p class="error_detail">' + error + '</p></br>');
            $('.exportStatus').fadeIn(500);
        }
        var jqxhr = $.get(request_url, function(res) {
            if (res.status) {
                var pdfLink = res.data;
                $('.exportStatus').fadeOut(100);
                $('.exportStatus').html('<p class="success">書き出し出来ました</p></br>');
                $('.exportStatus').fadeOut(500);
                $('.pdfLink').html($('<a target="blank_">PDFを開ける</a>').attr('href', pdfLink));
                $('.pdfLink').fadeIn(100);

            }else {
                 handleError(JSON.stringify(res));
            }
        })
        .done(function(r) {})
        .fail(function(e) {
            handleError(e);
        });

    }
//]]></script>


<!--{* 検索結果表示テーブル *}-->
<table class="list">

<col width="10%" />
<col width="8%" />
<col width="15%" />
<col width="8%" />
<col width="10%" />
<col width="10%" />
<col width="10%" />
<col width="10%" />
<col width="5%" />
<col width="5%" />
<col width="5%" />
<col width="4%" />
<!--{* ペイジェントモジュール連携用 *}-->
<!--{assign var=path value=`$smarty.const.MODULE_REALDIR`mdl_paygent/paygent_order_index.tpl}-->
<!--{if file_exists($path)}-->
    <!--{include file=$path}-->
<!--{else}-->
    <tr>
        <th>受注日</th>
        <th>注文番号</th>
        <th>お名前</th>
        <th>支払方法</th>
        <th>購入金額(円)</th>
        <th>全商品発送日</th>
        <th>対応状況</th>
        <th><label for="pdf_check">帳票</label> <input type="checkbox" name="pdf_check" id="pdf_check" onclick="eccube.checkAllBox(this, 'input[name=\'pdf_order_id[]\']')" /></th>
        <th>編集</th>
        <th>メール <input type="checkbox" name="mail_check" id="mail_check" onclick="eccube.checkAllBox(this, 'input[name=\'mail_order_id[]\']')" /></th>
        <th>削除</th>
        <th>PDF</th>
    </tr>

    <!--{section name=cnt loop=$arrResults}-->
        <!--{assign var=status value="`$arrResults[cnt].status`"}-->
        <tr style="background:<!--{$arrORDERSTATUS_COLOR[$status]}-->;">
            <td class="center"><!--{$arrResults[cnt].create_date|sfDispDBDate}--></td>
            <td class="center"><!--{$arrResults[cnt].order_id}--></td>
            <td class="center"><!--{$arrResults[cnt].order_name01|h}--> <!--{$arrResults[cnt].order_name02|h}--></td>
            <td class="center"><!--{$arrResults[cnt].payment_method|h}--></td>
            <td class="right"><!--{$arrResults[cnt].total|n2s}--></td>
            <td class="center"><!--{$arrResults[cnt].commit_date|sfDispDBDate|default:"未発送"}--></td>
            <td class="center"><!--{$arrORDERSTATUS[$status]}--></td>
            <td class="center">
                <input type="checkbox" name="pdf_order_id[]" value="<!--{$arrResults[cnt].order_id}-->" id="pdf_order_id_<!--{$arrResults[cnt].order_id}-->"/><label for="pdf_order_id_<!--{$arrResults[cnt].order_id}-->">一括出力</label><br />
                <a href="./" onClick="eccube.openWindow('pdf.php?order_id=<!--{$arrResults[cnt].order_id}-->','pdf_input','620','650'); return false;"><span class="icon_class">個別出力</span></a>
            </td>
            <td class="center"><a href="?" onclick="eccube.changeAction('<!--{$smarty.const.ADMIN_ORDER_EDIT_URLPATH}-->'); eccube.setModeAndSubmit('pre_edit', 'order_id', '<!--{$arrResults[cnt].order_id}-->'); return false;"><span class="icon_edit">編集</span></a></td>
            <td class="center">
                <!--{if $arrResults[cnt].order_email|strlen >= 1}-->
                    <input type="checkbox" name="mail_order_id[]" value="<!--{$arrResults[cnt].order_id}-->" id="mail_order_id_<!--{$arrResults[cnt].order_id}-->"/><label for="mail_order_id_<!--{$arrResults[cnt].order_id}-->">一括通知</label><br />
                    <a href="?" onclick="eccube.changeAction('<!--{$smarty.const.ADMIN_ORDER_MAIL_URLPATH}-->'); eccube.setModeAndSubmit('pre_edit', 'order_id', '<!--{$arrResults[cnt].order_id}-->'); return false;"><span class="icon_mail">個別通知</span></a>
                <!--{/if}-->
            </td>
            <td class="center"><a href="?" onclick="eccube.setModeAndSubmit('delete', 'order_id', <!--{$arrResults[cnt].order_id}-->); return false;"><span class="icon_delete">削除</span></a></td>
            <!--{if $arrResults[cnt].plg_kedit_flg == 1}-->
            <td class="center"><a href="?" onclick="showOrderDetail(<!--{$arrResults[cnt].order_id}-->); return false;"><span class="icon_delete">表示</span></a></td>
            <!--{else}-->
            <td class="center"><span>--</span></td>
            <!--{/if}-->
        </tr>
    <!--{/section}-->
<!--{/if}-->
</table>

<div id="pdf_show_box"></div>
<!--{* 検索結果表示テーブル *}-->