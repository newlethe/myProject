var pid = CURRENTAPPID;
//分辨率宽度和高度
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
var year=SYS_TIME_STR.substring(0,4);
var month=SYS_TIME_STR.substring(5,7);
var centerTable=
'<div id="proInfo" style="background:#E9EAFE;">' +

'<table width="100%" height="100%" border="0" bgcolor="#E9EAFE" cellpadding="0" cellspacing="0" style="table-layout:fixed;">' +
'  <tr height="10%">' +
'    <td colspan="20" align="center"><p class="projTitle">{prjName}</p></td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td style="width:5%">&nbsp;</td>' +
'    <td colspan="3">建设规模</td>' +
'    <td colspan="3"><span id="buildScale" name="buildScale" >{buildScale}</span></td>' +
'    <td>MW</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td colspan="6" align="left">总工期<u style="color:red;">&nbsp;&nbsp;{totalDateNum}&nbsp;&nbsp;</u>天，离完工还有：</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">投资规模</td>' +
'    <td colspan="3"><span id="investScale"  name="investScale" >{investScale}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td rowspan="3" colspan="9" align="center" bgcolor="#E9EAFE">' +
'      <div class="countdown">' +
'        <div class="countdown-time">{finishDateNum}</div>' +
'      </div></td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">开工日期</td>' +
'    <td colspan="2"><span id="buildStart"  name="buildStart" >{buildStart}</span></td>' +
'    <td>年</td>' +
'    <td><span id="buildStartMonth"  name="buildStartMonth" >{buildStartMonth}</span></td>' +
'    <td>月</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">预计完工日期</td>' +
'    <td colspan="2"><span id="buildEnd"  name="buildEnd" >{buildEnd}</span></td>' +
'    <td>年</td>' +
'    <td><span id="buildEndMonth"  name="buildEndMonth" >{buildEndMonth}</span></td>' +
'    <td>月</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr>' +
'    <td colspan="20" height="1%"></td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">概算总金额</td>' +
'    <td colspan="4"><span id="bdgTotalMoney"  name="bdgTotalMoney" >{bdgTotalMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td colspan="4">合同签订总金额</td>' +
'    <td colspan="4"><span id="conTotalMoney" name="conTotalMoney" >{conTotalMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">本年投资完成</td>' +
'    <td colspan="4"><span id="yearTzTotalMoney"  name="yearTzTotalMoney" >{yearTzTotalMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td colspan="4">自开工累计投资完成</td>' +
'    <td colspan="4"><span id="allTzTotalMoney" name="allTzTotalMoney" >{allTzTotalMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">本年付款金额</td>' +
'    <td colspan="4"><span id="yearTotalPayMoney"  name="yearTotalPayMoney" >{yearTotalPayMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td colspan="4">自开工累计付款金额</td>' +
'    <td colspan="4"><span id="allTotalPayMoney" name="allTotalPayMoney" >{allTotalPayMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">本月资金到位</td>' +
'    <td colspan="4"><span id="monthMoneyIn"  name="monthMoneyIn" >{monthMoneyIn}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td colspan="4">自开工累计资金到位</td>' +
'    <td colspan="4"><span id="allTotalMoneyIn"  name="allTotalMoneyIn" >{allTotalMoneyIn}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr>' +
'    <td colspan="20" height="1%"></td>' +
'  </tr>' +
'  <tr height="8%">' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">本月签订合同</td>' +
'    <td align="center"><a onclick="goToConMonthMoneyPage()" style="underline:true;color:blue;cursor:hand">' +
'  		<u style="color:red;cursor:hand" id="conMonthMoneyNum"  name="conMonthMoneyNum" >{conMonthMoneyNum}</u>' +
' 		</a>' +
'  	 </td>' +
'	 <td>个</td>' +
'  	 <td align="center" colspan="2"><a onclick="goToConMonthMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="conMonthMoney"  name="conMonthMoney" >{conMonthMoney}</u></a></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td  colspan="4">自开工累计签订合同</td>' +
'    <td align="center"><a onclick="goToConAllMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="allTotalConMoneyNum"  name="allTotalConMoneyNum" >{allTotalConMoneyNum}</u></a></td>' +
'    <td>个</td>' +
 '   <td align="center" colspan="2"><a onclick="goToConAllMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="allTotalConMoney"  name="allTotalConMoney" >{allTotalConMoney}</u></a></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr >' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">本月合同付款</td>' +
'    <td align="center"><a onclick="goToPayMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="monthPayMoneyNum"  name="monthPayMoneyNum" >{monthPayMoneyNum}</u></a></td>' +
'    <td>个</td>' +
 '   <td colspan="2" align="center"><a onclick="goToPayMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="monthPayMoney"  name="monthPayMoney" >{monthPayMoney}</u></a></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td colspan="4">自开工累计合同付款</td>' +
'    <td align="center"><a onclick="goToPayAllMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="allTotalPayMoneyNum"  name="allTotalPayMoneyNum" >{allTotalPayMoneyNum}</u></a></td>' +
'    <td>个</td>' +
 '   <td colspan="2" align="center"><a onclick="goToPayAllMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="allTotalPayMoney"  name="allTotalPayMoney" >{allTotalPayMoney}</u></a></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr >' +
'    <td>&nbsp;</td>' +
'    <td colspan="3">本月合同变更</td>' +
'    <td align="center"><a onclick="goToChaMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="conMonthChangeMoneyNum"  name="conMonthChangeMoneyNum" >{conMonthChangeMoneyNum}</u></a></td>' +
'    <td>个</td>' +
'    <td colspan="2" align="center"><a onclick="goToChaMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="conMonthChangeMoney"  name="conMonthChangeMoney" >{conMonthChangeMoney}</u></a></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td colspan="4">自开工累计合同变更</td>' +
'    <td align="center"><a onclick="goToChaAllMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="allTotalChangeMoneyNum"  name="allTotalChangeMoneyNum" >{allTotalChangeMoneyNum}</u></a></td>' +
'    <td>个</td>' +
'    <td colspan="2" align="center"><a onclick="goToChaAllMoneyPage()" style="underline:true;color:blue;cursor:hand"><u style="color:red;cursor:hand" id="allTotalChangeMoney"  name="allTotalChangeMoney" >{allTotalChangeMoney}</u></a></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr>' +
'    <td colspan="20" height="3%"></td>' +
'  </tr>' +
'</table>' +

'</div>' +
'';	

var columns1=[
  {id: 'prjName', type: 'string'},//项目名称
  {id: 'buildScale', type: 'double'},  //投资规模
  {id: 'investScale', type: 'double'},//建设规模
  {id: 'buildStart', type: 'string'},//开工日期年
  {id: 'buildStartMonth', type: 'string'},//开工日期月
  {id: 'buildEnd', type: 'string'},//结束日期年
  {id: 'buildEndMonth', type: 'string'},//结束日期月
  {id: 'bdgTotalMoney', type: 'double'},//概算金额
  {id: 'yearTzTotalMoney', type: 'double'},//本年投资完成
  {id: 'yearTotalPayMoney', type: 'double'},//本年付款金额
  {id: 'monthMoneyIn', type: 'double'},//本月资金到位
  {id: 'totalDateNum', type: 'integer'},//总工期
  {id: 'finishDateNum', type: 'integer'},//离完工还有天数
  {id: 'conTotalMoney', type: 'double'},//合同签订总金额
  {id: 'allTzTotalMoney', type: 'double'},//自开工累计投资完成
  {id: 'allTotalPayMoney', type: 'double'},//自开工累计付款金额
  {id: 'allTotalMoneyIn', type: 'double'},//自开工累计自己到位
  
  {id: 'conMonthMoneyNum', type: 'double'},//本月签订合同个数
  {id: 'conMonthMoney', type: 'double'},//本月签订合同金额
  {id: 'allTotalConMoneyNum', type: 'double'},//自开工累计签订合同个数
  {id: 'allTotalConMoney', type: 'double'},//自开工累计签订合同金额
  {id: 'monthPayMoneyNum', type: 'double'},//本月合同付款个数
  {id: 'monthPayMoney', type: 'double'},//本月累计合同付款金额
  {id: 'allTotalPayMoneyNum', type: 'double'},//自开工累计合同付款个数
  {id: 'allTotalPayMoney', type: 'double'},//自开工累计合同付款金额
  {id: 'conMonthChangeMoneyNum', type: 'double'},//本月合同变更数
  {id: 'conMonthChangeMoney', type: 'double'},//本月合同变更金额
  {id: 'allTotalChangeMoneyNum', type: 'double'},//自开工累计合同变更数
  {id: 'allTotalChangeMoney', type: 'double'},//自开通累计合同变更金额
  
  {id: 'lastMonthNum',  type: 'double'}//上月数据完整性考核分数
]
var inputData1 = {};
DWREngine.setAsync(false);
pcPrjService.getProItemIndexData(CURRENTAPPID,function(list){
	list[0].investScale = (list[0].investScale).toFixed(2);
	list[0].bdgTotalMoney=(list[0].bdgTotalMoney).toFixed(2);
	list[0].yearTzTotalMoney = (list[0].yearTzTotalMoney).toFixed(2);
	list[0].yearTotalPayMoney = (list[0].yearTotalPayMoney).toFixed(2);
	list[0].monthMoneyIn = (list[0].monthMoneyIn).toFixed(2);
	list[0].allTzTotalMoney = (list[0].allTzTotalMoney).toFixed(2);
	list[0].conTotalMoney = (list[0].conTotalMoney).toFixed(2);
	list[0].allTotalPayMoney = (list[0].allTotalPayMoney).toFixed(2);
	list[0].allTotalMoneyIn = (list[0].allTotalMoneyIn).toFixed(2);
	
	list[0].conMonthMoney = (list[0].conMonthMoney).toFixed(2);
	list[0].conMonthMoneyNum = (list[0].conMonthMoneyNum).toFixed(0);
	list[0].monthPayMoney = (list[0].monthPayMoney).toFixed(2);
	list[0].monthPayMoneyNum = (list[0].monthPayMoneyNum).toFixed(0);
	list[0].conMonthChangeMoney = (list[0].conMonthChangeMoney).toFixed(2);
	list[0].conMonthChangeMoneyNum = (list[0].conMonthChangeMoneyNum).toFixed(0);
	list[0].allTotalConMoney = (list[0].allTotalConMoney).toFixed(2);
	list[0].allTotalConMoneyNum = (list[0].allTotalConMoneyNum).toFixed(0);
	list[0].allTotalChangeMoney = (list[0].allTotalChangeMoney).toFixed(2);
	list[0].allTotalChangeMoneyNum = (list[0].allTotalChangeMoneyNum).toFixed(0);
	list[0].allTotalPayMoneyNum = (list[0].allTotalPayMoneyNum).toFixed(0);
	
	inputData1 = list[0]
})
DWREngine.setAsync(true);

//折线图
//火电项目14个里程碑节点
//风电项目7个里程碑节点
//其他项目根节点的下一个层级节点
var liInitData = {};
var eastTable =
	'<div id="liTable" style="background:#E9EAFE;">' +
	'<div id="myChart"></div>' +
	'<table width="98%" id="liListTable" height="100%" align="center" bgcolor="#E9EAFE" border="0" cellpadding="0" cellspacing="10">' +
		'<tr>' +
	'<tpl for="lichengbei">' +
			'<td>{id}.{name}</td>' +
		'<tpl if="id % 3 === 0">' +
		'</tr>' +
		'<tr>' +
		'</tpl>' +
	'</tpl>' +
		'</tr>' +
	'</table>' +
	'</div>' +
	'';

var southTable=
	'<table width="100%" height="100%" border="0" bgcolor="#E9EAFE"  cellpadding="0" cellspacing="10" class="buttons">' +
	'  <tr>' +
	'    <td align="center"><input value="项目执行过程概览" type="button" id="prjAct" name="prjAct" onClick="event(this)"></td>' +
	'    <td align="center"><input value="合同动态管理台账" type="button" id="con" name="con" onClick="event(this)"></td>' +
	'    <td align="center"><input value="概算动态管理台账" type="button" id="bdg" name="bdg" onClick="event(this)"></td>' +
	'    <td align="center"><input value="概算动态执行监控" type="button" id="bdgAct" name="bdgAct" onClick="event(this)"></td>' +
	'    <td align="center"><input value="合同执行情况报表" type="button" id="conAct" name="conAct" onClick="event(this)"></td>' +
	'  </tr>' +
	'  <tr>' +
	'    <td align="center"><input value="招标合同月报汇总查询" type="button" id="bidCon" name="bidCon" onClick="event(this)"></td>' +
	'    <td align="center"><input value="投资完成月报汇总查询" type="button" id="gzwc" name="gzwc" onClick="event(this)"></td>' +
	'    <td align="center"><input value="进度情况月报汇总查询" type="button" id="jdgk" name="jdgk" onClick="event(this)"></td>' +
	'    <td align="center"><input value="质量检验月报汇总查询" type="button" id="zlgk" name="zlgk" onClick="event(this)"></td>' +
	'    <td align="center"><input value="监理报告汇总查询" type="button" id="jlbg" name="jlbg" onClick="event(this)"></td>' +
	'  </tr>' +
	'</table>' +
	'';

var southTable=
'			<table width="100%" height="100%" border="0" bgcolor="#E9EAFE"  cellpadding="0" cellspacing="" class="buttons1">'+
'				<tr">'+
'					<td>'+
'						<input value="投资完成汇总表（合同）" type="button" id="tzwcCon" name="tzwcCon" onclick="event(this)">'+
'					</td>'+
'					<td>'+
'						<input value="投资完成汇总表（概算）" type="button" id="tzwcBdg" name="tzwcBdg" onclick="event(this)">'+
'					</td>'+
'					<td>'+
'						<input value="一级网络计划" type="button" id="wljh" name="wljh" onclick="event(this)">'+
'					</td>'+
'					<td>'+
'						<input value="月进度任务分析" type="button" id="rwfx" name="rwfx" onclick="event(this)">'+
'					</td>'+
'					<td>'+
'						<input value="工程安全-隐患整改跟踪" type="button" id="gcaqzg" name="gcaqzg" onclick="event(this)">'+
'					</td>'+
'				</tr>'+
'				<tr">'+
'					<td>'+
'						<input value="多级沟通信息查询" type="button" id="djgt" name="djgt" onclick="event(this)">'+
'					</td>'+
'					<td>'+
'						<input value="标准库" type="button" id="bzk" name="bzk" onclick="event(this)">'+
'					</td>'+
'					<td>'+
'						<input value="主要事件" type="button" id="zysj" name="zysj" onclick="event(this)">'+
'					</td>'+
'					<td>'+
'						<input value="综合报表" type="button" id="zhbb" name="zhbb" onclick="event(this)">'+
'					</td>'+
'				</tr>'+
'			</table>';

var chart;

//上半部高度
var partHeight = 397;
//折线图宽度固定
var eastWidth = 480;
if(screenWidth>1024) eastWidth = (screenWidth/2)-100
//项目基本信息宽度
var centerWidth = 535
//整个宽度
var allWidth = parseInt(eastWidth) + parseInt(centerWidth);

Ext.onReady(function(){
	var centerPanel =  new Ext.Panel({
        bodyStyle : 'background:#E9EAFE',
		region: 'center',
		width : centerWidth,
		height : partHeight
	});
	var eastPanel =  new Ext.Panel({ 
        bodyStyle : 'background:#E9EAFE',
		region: 'east',
		width : eastWidth,
		height : partHeight
	});
	
	var southLeft =new Ext.Panel({ 
        bodyStyle : 'background:#E9EAFE',
		region: 'center',
		border : false,
		collapsed : false,
		width : centerWidth
	});
	
	var southRight =new Ext.Panel({ 
        bodyStyle : 'background:#E9EAFE',
		region: 'east',
		width : eastWidth,
		split:true,
		collapsed : false,
		html:'<div id="msg" style="height:50%;background:#E9EAFE;"></div>'	
	});
	
	var southPanel =   new Ext.Panel({ 
        bodyStyle : 'background:#E9EAFE',
		layout:'border',
		region: 'center',
		width : allWidth,
		items:[southLeft,southRight]
	});
      
	var panel = new Ext.Panel({
        bodyStyle : 'background:#E9EAFE',
		height : partHeight,
		width : allWidth,
		layout : 'border',
		region: 'north',
		border : false,
		items : [centerPanel,eastPanel]
	});
	
	var allPanel = new Ext.Panel({
        bodyStyle : 'background:#E9EAFE',
		layout : 'auto',
		border : false,
		autoScroll : true,
		width : allWidth,
		items : [panel,southPanel]
	})

	var viewport = new Ext.Viewport({
        bodyStyle : 'background:#E9EAFE',
		layout : 'fit',
		border : false,
		items : [allPanel]
	});
	
	
	var projectuid = "";
	var sql = "select p.uid_ from edo_project p where p.pid = '"+CURRENTAPPID+"' and p.name_ = '里程碑计划'";
	DWREngine.setAsync(false);
	baseDao.getData(sql,function(rtn){
		projectuid = rtn;
	});
	DWREngine.setAsync(true);
	
	//TODO  遗留flex折线图和风电、火电、其他类型项目的里程碑节点展示
	DWREngine.setAsync(false);
	pcPrjService.getLiChengBeiByType(CURRENTAPPID,function(str){
		liInitData = eval('('+str+')')
	})
	DWREngine.setAsync(true);
	
	var viewXtp1 = new Ext.XTemplate(centerTable);
	viewXtp1.overwrite(centerPanel.body, inputData1);
	var viewXtp2 = new Ext.XTemplate(eastTable);
	viewXtp2.overwrite(eastPanel.body, liInitData);
	var viewXtp3 = new Ext.XTemplate(southTable);
	viewXtp3.overwrite(southLeft.body, '');
	
	
	//参数依次为：swf文件、组件ID、宽度、高度、背景颜色、是否缩放
    //缩放参数：0图形不随容器大小变化，1图形随容器大小等比例缩放
    chart = new Carton("/"+ROOT_CHART+"/XCarton.swf", "ChartId", "500", "100%", "#E9EAFE", "1");
    chart.render("myChart");
    chart.setParam("projectuid",projectuid);
    //读取服务器端的配置文件，根据不同项目类型读取不同cml文件
    //包括风电，火电，其它类别
	chart.setDataURL("PCBusiness/cml/myChartJiaJie.cml");
	
	loadMsg()
    getAuditScore();
    
    if(screenWidth > 1024){
		//调整宽度
		var allPenelWidth = allPanel.getInnerWidth();
		centerPanel.setWidth(allPenelWidth - eastWidth);
		southPanel.setWidth(allPenelWidth);
		panel.setWidth(allPenelWidth);
		allPanel.setWidth(allPenelWidth);
		
		//调整高度
		var allPenelHeight = allPanel.getInnerHeight();
		centerPanel.setHeight(allPenelHeight - 100 - 9);
		eastPanel.setHeight(allPenelHeight - 100 - 9);
		southPanel.setHeight(120 - 9);
		panel.setHeight(allPenelHeight - 120 - 9);
		allPanel.setHeight(allPenelHeight);
	}
	
	//调整里程碑名称table高度
	var liListTable = document.getElementById("liListTable");
	var flexHeight = document.getElementById("myChart").offsetHeight;
	var eastPanelHeight = eastPanel.getInnerHeight();
	liListTable.setAttribute("height",eastPanelHeight-flexHeight-20);
	
	allPanel.on("bodyresize",function(){
		var buttonHeight = 120;
		if(screenWidth > 1024){
			//调整宽度
			var allPenelWidth = allPanel.getInnerWidth();
			eastWidth = (screenWidth/2)-100
			eastPanel.setWidth(eastWidth);
			centerPanel.setWidth(allPenelWidth - eastWidth);
			southPanel.setWidth(allPenelWidth);
			panel.setWidth(allPenelWidth);
		}
			//调整高度
			var allPenelHeight = allPanel.getInnerHeight();
			centerPanel.setHeight(allPenelHeight - buttonHeight - 9);
			eastPanel.setHeight(allPenelHeight - buttonHeight - 9);
			southPanel.setHeight(buttonHeight - 9);
			panel.setHeight(allPenelHeight - buttonHeight - 9);
			
			//调整里程碑名称table高度
			var liListTable = document.getElementById("liListTable");
			var flexHeight = document.getElementById("myChart").offsetHeight;
			var eastPanelHeight = eastPanel.getInnerHeight();
			liListTable.setAttribute("height",eastPanelHeight-flexHeight-20);
			
	});
	
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
		var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
		window.showModalDialog(
			BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp",
			"","dialogWidth:980px;dialogHeight:450px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
	
	function event(btn){
		var csql = "select a.* from (SELECT t.* FROM sgcc_ini_unit t START WITH t.unitid = '"+USERDEPTID+"' connect by t.unitid = PRIOR t.upunit) a where a.unit_type_id='7'";
		var count;
		DWREngine.setAsync(false);
			baseDao.getData(csql,function(list){
				if(list && list !=null && list !=''){
					count = list.length;
				}
			});
		DWREngine.setAsync(true);
		if(count >0){
			return;
		}
		var aw = 1024,ah = 768;
		var type="";
		try{
			ah = screen.availHeight;
			aw = screen.availWidth;
		}catch(e){}
		var btnId =  btn.id;
		var scheduleURL ="";
		if(btnId=="tzwcCon"){
			type ="投资完成汇总表（合同）";
			scheduleURL = BASE_PATH+"PCBusiness/pcCon/pc.con.info.report.jsp";//投资完成汇总表（合同）
		}else if(btnId =="tzwcBdg"){
			type = "投资完成汇总表（概算）";
			scheduleURL = BASE_PATH+"PCBusiness/budget/bdgEntry/pc.bdg.info.report.jsp"; //投资完成汇总表（概算）
		}else if(btnId=="wljh"){
			type = "一级网络计划";
			scheduleURL =BASE_PATH +"PCBusiness/jdgk/pc.jdgk.project.jsp?plan=yi";//一级网络计划
		}else if(btnId=="rwfx"){
			type = "月进度任务分析";
			scheduleURL = BASE_PATH +"PCBusiness/jdgk/pc.jdgk.view.month.task.gantt.jsp";//月进度任务分析
		}else if(btnId=="gcaqzg"){
			type="工程安全安全隐患整改跟踪";
			scheduleURL = BASE_PATH +"PCBusiness/aqgk/baseInfoInput/pc.aqgk.hiddenDanger.trace.jsp"  //工程安全安全隐患整改跟踪
		}else if(btnId == "djgt"){
			type="多级沟通信息查询";
			scheduleURL = BASE_PATH +"jsp/messageCenter/search/com.fileSearch.publish.query.jsp?rootId=info_root" //多级沟通信息查询
		}else if(btnId == "bzk"){
			type ="标准库";
			scheduleURL =BASE_PATH + "Business/fileAndPublish/search/com.fileSearch.main.jsp?rootId=bzk"; //标准库
		}else if(btnId == "zysj"){
			type="主要事件";
			scheduleURL = BASE_PATH + "Business/fileAndPublish/fileManage/com.fileManage.query.jsp?rootId=big_event_root&canReport=1";// 主要事件
		}else if(btnId="zhbb"){
			type = "综合报表";
			scheduleURL = BASE_PATH + "PCBusiness/report/pc.proj.info.jiajie.index.report.jsp";       //综合报表
		}
		window.showModalDialog(scheduleURL,type,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
							"resizable:yes;Minimize:no;Maximize:yes");

	}
	
	function loadMsg(){
		var tpl = new Ext.Template(
			'<div class="bq" style="background:#E9EAFE;">',
			    '<a href="javascript:openTaskWindow()" class="tb01">您目前有<span>{unFlow}</span>条待办事项未处理</a>',
	  			'<a href="javascript:openMsgWindow()" class="tb02">您目前有<span id="msgNum">{unMsg}</span>条信息未阅读</a>',
			    '<a href="javascript:openScoreNum()" class="score">上月数据完整性考核分数<span id="lastMonthScore">0</span>分</a>',
		    '</div>'
		 )
		var taskSql = "select count(*) from task_view where tonode='" + USERID + "' and flag='0'";
		var o = new Object();
		var publishUrl='';
		var uploadUrl='';
		
		DWREngine.setAsync(false);
			baseDao.getDataAutoCloseSes(taskSql,function(list){
				o.unFlow = list[0];
			})
			ComFileManageDWR.getUnreadMsgNum(USERID, USERDEPTID, function(retVal){
				o.unMsg = retVal;
			});
		DWREngine.setAsync(true);
		tpl.overwrite('msg',o);
	}

//获得项目单位数据完整性审核评分	
function getAuditScore(){
		DWREngine.setAsync(false);
			pcPrjService.getLastMonthNums(USERBELONGUNITID, function(score){
				if('none'==score){
					score = '0';
				}
				document.getElementById('lastMonthScore').innerHTML = score;
			})
		DWREngine.setAsync(true);
}	

//跳转到动态数据查看页面
	function openTaskWindow(){
		parent.showTaskWin();
	}
 	function openMsgWindow(){
		var msgWin = parent.showMsgWin();
		
		msgWin.on('hide', function(p){
			getUnreadNum();
		});
	}
	
	function getUnreadNum(){
	ComFileManageDWR.getUnreadMsgNum(USERID, USERDEPTID, function(retVal){
				document.getElementById('msgNum').innerHTML = retVal;
			});
	}
	
function openScoreNum(){
		//var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
		window.showModalDialog(
			BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp?view=1",
			"","dialogWidth:980px;dialogHeight:450px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
function goToConMonthMoneyPage(){//本月签订合同页面
	var csql = "select a.* from (SELECT t.* FROM sgcc_ini_unit t START WITH t.unitid = '"+USERDEPTID+"' connect by t.unitid = PRIOR t.upunit) a where a.unit_type_id='7'";
	var count;
	DWREngine.setAsync(false);
		baseDao.getData(csql,function(list){
			if(list && list !=null && list !=''){
				count = list.length;
			}
		});
	DWREngine.setAsync(true);
	if(count >0){
		return;
	}
	//Business/contract/cont.generalInfo.input.jsp?query=true
	var year=SYS_TIME_STR.substring(0,4);
	var month=SYS_TIME_STR.substring(5,7);
	var arr='';
	DWREngine.setAsync(false);
        db2Json.selectData("select conid from con_ove t where t.pid='"+pid+"' and to_char(signdate,'yyyy')= '"+year+"' and to_char(signdate,'MM')= '"+month+"'", function (conids) {
	    	var list = eval(conids);
	    	if(list!=null){
	   	 		for(var i=0;i<list.length;i++){
	   	 			var conid=list[i].conid;
	   	 			arr+=conid+",";
	   	 		}
	     	}  
			if(arr!=''){
				arr=arr.substring(0,arr.length-1);
				var url=CONTEXT_PATH+"/Business/contract/cont.generalInfo.input.jsp?query=true&conids="+arr;
				window.open(url,'合同基本信息查询', 'fullscreen'); 
			}	     		 
	     });
	DWREngine.setAsync(true);
}

function goToConAllMoneyPage(){//自开工累计签订合同
	var csql = "select a.* from (SELECT t.* FROM sgcc_ini_unit t START WITH t.unitid = '"+USERDEPTID+"' connect by t.unitid = PRIOR t.upunit) a where a.unit_type_id='7'";
	var count;
	DWREngine.setAsync(false);
		baseDao.getData(csql,function(list){
			if(list && list !=null && list !=''){
				count = list.length;
			}
		});
	DWREngine.setAsync(true);
	if(count >0){
		return;
	}
	//Business/contract/cont.generalInfo.input.jsp?query=true
	var arr='';
	DWREngine.setAsync(false);
        db2Json.selectData("select conid from con_ove t where t.pid='"+pid+"'", function (conids) {
	    	var list = eval(conids);
	    	if(list!=null){
	   	 		for(var i=0;i<list.length;i++){
	   	 			arr+=list[i].conid+",";
	   	 			}
	     		 }    		 
	if(arr!=''){
		arr=arr.substring(0,arr.length-1);
		var url=CONTEXT_PATH+"/Business/contract/cont.generalInfo.input.jsp?query=true";
		window.open(url,'合同基本信息查询', 'fullscreen'); 

	}		     
	     });
	DWREngine.setAsync(true);

}

function goToPayMoneyPage(){//本月合同付款
	var csql = "select a.* from (SELECT t.* FROM sgcc_ini_unit t START WITH t.unitid = '"+USERDEPTID+"' connect by t.unitid = PRIOR t.upunit) a where a.unit_type_id='7'";
	var count;
	DWREngine.setAsync(false);
		baseDao.getData(csql,function(list){
			if(list && list !=null && list !=''){
				count = list.length;
			}
		});
	DWREngine.setAsync(true);
	if(count >0){
		return;
	}
	///Business/contract/cont.main.frame.jsp
	var year=SYS_TIME_STR.substring(0,4);
	var month=SYS_TIME_STR.substring(5,7);
	var arr='';
	DWREngine.setAsync(false);
	var sql="select distinct(t.conid) from con_ove t where t.pid='"+pid+"' and t.conid in(select p.conid from con_pay p  where to_char(p.paydate,'yyyy')= '"+year+"' and to_char(p.paydate,'MM')= '"+month+"')";
        db2Json.selectData(sql, function (conids) {
	    	var list = eval(conids);
	    	if(list!=null){
	   	 		for(var i=0;i<list.length;i++){
	   	 			var conid=list[i].conid;
	   	 			arr+=conid+",";
	   	 			}
	     		 }  
	if(arr!=''){
		arr=arr.substring(0,arr.length-1);
		var url=CONTEXT_PATH+"/Business/contract/cont.main.frame.jsp?optype=conpay&dyView=true&conids="+arr;
		window.open(url,'合同基本信息查询', 'fullscreen'); 
	}	     		 
	     		 
	     });
	DWREngine.setAsync(true);	
}

function goToPayAllMoneyPage(){//自开工累计付款
	var csql = "select a.* from (SELECT t.* FROM sgcc_ini_unit t START WITH t.unitid = '"+USERDEPTID+"' connect by t.unitid = PRIOR t.upunit) a where a.unit_type_id='7'";
	var count;
	DWREngine.setAsync(false);
		baseDao.getData(csql,function(list){
			if(list && list !=null && list !=''){
				count = list.length;
			}
		});
	DWREngine.setAsync(true);
	if(count >0){
		return;
	}
	///Business/contract/cont.main.frame.jsp
	var arr='';
	DWREngine.setAsync(false);
	var sql="select distinct(t.conid) from con_ove t where t.pid='"+pid+"' and  t.conid in(select p.conid from con_pay p)";
        db2Json.selectData(sql, function (conids) {
	    	var list = eval(conids);
	    	if(list!=null){
	   	 		for(var i=0;i<list.length;i++){
	   	 			var conid=list[i].conid;
	   	 			arr+=conid+",";
	   	 			}
	     		 }  
	if(arr!=''){
		arr=arr.substring(0,arr.length-1);
		var url=CONTEXT_PATH+"/Business/contract/cont.main.frame.jsp?optype=conpay&dyView=true&conids="+arr;
		window.open(url,'合同基本信息查询', 'fullscreen'); 
	}	     		 
	     		 
	     });
	DWREngine.setAsync(true);		
	
}

function goToChaMoneyPage(){//本月合同变更
	var csql = "select a.* from (SELECT t.* FROM sgcc_ini_unit t START WITH t.unitid = '"+USERDEPTID+"' connect by t.unitid = PRIOR t.upunit) a where a.unit_type_id='7'";
	var count;
	DWREngine.setAsync(false);
		baseDao.getData(csql,function(list){
			if(list && list !=null && list !=''){
				count = list.length;
			}
		});
	DWREngine.setAsync(true);
	if(count >0){
		return;
	}
	///Business/contract/cont.main.frame.jsp
	var sql="select distinct(t.conid) from con_ove t where t.pid='"+pid+"'  and t.conid in(select p.conid from con_cha p  where to_char(p.chadate,'yyyy')= '"+year+"' and to_char(p.chadate,'MM')= '"+month+"')";	
	var arr='';
	DWREngine.setAsync(false);
	     db2Json.selectData(sql, function (conids) {
	    	var list = eval(conids);
	    	if(list!=null){
	   	 		for(var i=0;i<list.length;i++){
	   	 			var conid=list[i].conid;
	   	 			arr+=conid+",";
	   	 			}
	     		 }  
	if(arr!=''){
		arr=arr.substring(0,arr.length-1);
		var url=CONTEXT_PATH+"/Business/contract/cont.main.frame.jsp?optype=concha&dyView=true&conids="+arr;
		window.open(url,'合同基本信息查询', 'fullscreen'); 
	}	     		 
	     		 
	     });
	DWREngine.setAsync(true);	
}

function goToChaAllMoneyPage(){//自开工累计变更
	var csql = "select a.* from (SELECT t.* FROM sgcc_ini_unit t START WITH t.unitid = '"+USERDEPTID+"' connect by t.unitid = PRIOR t.upunit) a where a.unit_type_id='7'";
	var count;
	DWREngine.setAsync(false);
		baseDao.getData(csql,function(list){
			if(list && list !=null && list !=''){
				count = list.length;
			}
		});
	DWREngine.setAsync(true);
	if(count >0){
		return;
	}
	///Business/contract/cont.main.frame.jsp
	var month=SYS_TIME_STR.substring(5,7);
	var arr='';
	DWREngine.setAsync(false);
	var sql="select distinct(t.conid) from con_ove t where t.pid='"+pid+"' and  t.conid in(select p.conid from con_cha p)";
        db2Json.selectData(sql, function (conids) {
	    	var list = eval(conids);
	    	if(list!=null){
	   	 		for(var i=0;i<list.length;i++){
	   	 			var conid=list[i].conid;
	   	 			arr+=conid+",";
	   	 			}
	     		 }  
	if(arr!=''){
		arr=arr.substring(0,arr.length-1);
		var url=CONTEXT_PATH+"/Business/contract/cont.main.frame.jsp?optype=concha&dyView=true&conids="+arr;
		window.open(url,'合同基本信息查询', 'fullscreen'); 
	}	     		 
	     		 
	     });
	DWREngine.setAsync(true);	
}