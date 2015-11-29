/**
 *  
 *  
 *  
 */
var pid=CURRENTAPPID;;
var centerTab =
'<div id="proInfo">' +

'<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="10">' +
' <tr>' +
'   <td colspan="9"  height="100" align="center"><p class="projTitle">{prjName}</p></td>' +
'  </tr>' +
'  <tr>' +
'    <td width="50%"><table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" style="border:#999 solid 1px;">' +
'      <tr>' +
'        <td rowspan="4">&nbsp;</td>' +
'        <td width="100" >建设规模</td>' +
'        <td colspan="3" width="110"><span id="buildScale" name="buildScale">{buildScale}</span></td>' +
'        <td  width="40">MW</td>' +
'        <td rowspan="4">&nbsp;</td>' +
//'        <td align="center" >总工期<u style="color:red;">{totalDateNum}</u>天,{titleText}：</td>' +
'        <td align="center" >&nbsp;&nbsp;{titleText}：</td>' +
'        <td rowspan="4">&nbsp;</td>' +
'      </tr>' +
'      <tr>' +
'        <td >投资规模</td>' +
'        <td colspan="3" width="110"><span id="investScale"  name="investScale">{investScale}</span></td>' +
'        <td  width="40">万元</td>' +
'        <td rowspan="3"  align="center"><div class="countdown"> <div class="countdown-time">{finishDateNum}</div></div></td>' +
'      </tr>' +
'      <tr>' +
'        <td >开工日期</td>' +
'        <td width="55"><span id="buildStart"  name="buildStart">{buildStart}</span></td>' +
'        <td width="20">年</td>' +
'        <td width="30"><span id="buildStartMonth"  name="buildStartMonth">{buildStartMonth}</span></td>' +
'        <td  width="24" >月</td>' +
'        </tr>' +
'      <tr>' +
'        <td  width="100">预计完工日期</td>' +
'        <td width="55"><span id="buildEnd"  name="buildEnd">{buildEnd}</span></td>' +
'        <td>年</td>' +
'        <td><span id="buildEndMonth"  name="buildEndMonth">{buildEndMonth}</span></td>' +
'        <td  width="24" >月</td>' +
'        </tr>' +
'    </table></td>' +
'    <td width="50%"><table width="100%" height="100%" style="border:#999 solid 1px;" align="center" border="0" cellspacing="0" cellpadding="0">' +
'    <tr>' +
'        <td rowspan="3">&nbsp;</td>' +
'        <td  width="100">概算总金额</td>' +
'        <td width="110"><span id="bdgTotalMoney"  name="bdgTotalMoney">{bdgTotalMoney}</span></td>' +
'        <td  width="40">万元</td>' +
'        <td rowspan="3">&nbsp;</td>' +
'        <td width="140" >本月资金到位</td>' +
'        <td width="110"><span id="monthMoneyIn"  name="monthMoneyIn">{monthMoneyIn}</span></td>' +
'        <td  width="40">万元</td>' +
'        <td rowspan="3">&nbsp;</td>' +
'      </tr>' +
'      <tr>' +
'        <td  width="100">本年投资完成</td>' +
'        <td><span id="yearTzTotalMoney"  name="yearTzTotalMoney">{yearTzTotalMoney}</span></td>' +
'        <td  width="40">万元</td>' +
'        <td >自开工累计投资完成</td>' +
'        <td><span id="allTzTotalMoney" name="allTzTotalMoney">{allTzTotalMoney}</span></td>' +
'        <td  width="40">万元</td>' +
'      </tr>' +
'      <tr>' +
'        <td  width="100">本年付款金额</td>' +
'        <td><span id="yearTotalPayMoney"  name="yearTotalPayMoney">{yearTotalPayMoney}</span></td>' +
'        <td  width="40">万元</td>' +
'        <td >自开工累计付款金额</td>' +
'        <td><span id="allTotalPayMoney" name="allTotalPayMoney">{allTotalPayMoney}</span></td>' +
'        <td  width="40">万元</td>' +
'      </tr>' +
'    </table></td>' +
'  </tr>' +
'  <tr>' +
'    <td height="80" colspan="2"><p class="kaohe">上月完整性考核分数 <u style="color:red;cursor:pointer;" onclick="openNum()">&nbsp;&nbsp;{lastMonthNum}&nbsp;&nbsp;</u>分</p></td>' +
'  </tr>' +
'  <tr>' +
'    <td height="40" colspan="2">&nbsp;</td>' +
'  </tr>' +
'</table>' +

'</div>';

var columns1=[
              {id: 'prjName', type: 'string'},//项目名称
              {id: 'buildScale', type: 'double'}, //建设规模 
              {id: 'investScale', type: 'double'},//投资规模
              {id: 'buildStart', type: 'string'},//开工日期年
              {id: 'buildStartMonth', type: 'string'},//开工日期月
              {id: 'buildEnd', type: 'string'},//结束日期年
              {id: 'buildEndMonth', type: 'string'},//结束日期月
              {id: 'bdgTotalMoney', type: 'double'},//概算金额
              {id: 'yearTzTotalMoney', type: 'double'},//本年投资完成
              {id: 'yearTotalPayMoney', type: 'double'},//本年付款金额
              {id: 'monthMoneyIn', type: 'double'},//本月资金到位
              {id: 'totalDateNum', type: 'integer'},//总工期
              {id: 'titleText' ,type: 'string'},    //修改完工与否的标题
              {id: 'finishDateNum', type: 'integer'},//离完工还有天数
              {id: 'allTzTotalMoney', type: 'double'},//自开工累计投资完成
              {id: 'allTotalPayMoney', type: 'double'},//自开工累计付款金额
              {id: 'lastMonthNum',  type: 'double'}//上月数据完整性考核分数
]

var inputData1 = {};
DWREngine.setAsync(false);
pcPrjService.getProItemIndexData(pid,function(list){
	list[0].investScale = (list[0].investScale).toFixed(0);
	list[0].bdgTotalMoney=(list[0].bdgTotalMoney).toFixed(0);
	list[0].yearTzTotalMoney = (list[0].yearTzTotalMoney).toFixed(0);
//	list[0].yearTotalPayMoney = (list[0].yearTotalPayMoney).toFixed(0);
//	list[0].monthMoneyIn = (list[0].monthMoneyIn).toFixed(0);
	list[0].allTzTotalMoney = (list[0].allTzTotalMoney).toFixed(0);
	list[0].allTotalPayMoney = (list[0].allTotalPayMoney).toFixed(0);
	inputData1 =list[0];
})
DWREngine.setAsync(true);
Ext.onReady(function(){
   			var centerPanel =  new Ext.Panel({
                            layout: 'fit',
		                    region: 'center'
		                })
  
	        var viewport = new Ext.Viewport({
						layout : 'border',
						items : [centerPanel]
					});

			var viewXtpCenter = new Ext.XTemplate(centerTab);
			    viewXtpCenter.overwrite(centerPanel.body,inputData1);
			    
			    
	var minWin = parent.minWinBtn;
	if(minWin){
		minWin.handler = function(){
			parent.hd.expand();
			parent.lt.expand();
        	parent.maxWinBtn.show();
        	parent.minWinBtn.hide();
		}
	}
	
	var maxWin = parent.maxWinBtn;
	if(maxWin){
		maxWin.handler = function(){
			parent.hd.collapse()
        	parent.lt.collapse()
        	parent.east.collapse()
        	parent.maxWinBtn.hide();
        	parent.minWinBtn.show();
		}
	}

});
	function openNum(){
		//var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
		window.showModalDialog(
			BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp?view=1",
			"","dialogWidth:980px;dialogHeight:450px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
