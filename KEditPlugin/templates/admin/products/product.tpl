
        <tr>
            <th>KEdit対象設定</th>
            <td>
                <span class="attention"><!--{$arrErr.plg_kedit_flg}--></span>
                <input type="checkbox" name="plg_kedit_flg" value="1" style="<!--{if $arrErr.plg_kedit_flg != ""}-->background-color: <!--{$smarty.const.ERR_COLOR}-->;<!--{/if}-->" <!--{if $arrForm.plg_kedit_flg == 1}-->checked="checked"<!--{/if}--> />KEdit対象商品に設定する
            </td>
        </tr>