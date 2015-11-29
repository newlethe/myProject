
//分辨率宽度和高度
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
var _ct_tool = parent.ct_tool;


var centerTable=
'<div id="proInfo">' +

'<table width="100%" height="100%" border="0" bgcolor="#FFFFFF" cellpadding="0" cellspacing="0">' +
'  <tr height="45">' +
'    <td colspan="11" align="center"><p class="projTitle">{prjName}</p></td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td width="132">建设规模</td>' +
'    <td colspan="3"><span id="buildScale" name="buildScale" >{buildScale}</span></td>' +
'    <td width="30">MW</td>' +
'    <td>&nbsp;</td>' +
//'    <td colspan="3" align="left">总工期<u style="color:red;">&nbsp;{totalDateNum}&nbsp;</u>天，{titleText}：</td>' +
'    <td colspan="3" align="left">&nbsp;&nbsp;{titleText}：</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td>投资规模</td>' +
'    <td colspan="3"><span id="investScale"  name="investScale" >{investScale}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td rowspan="3" colspan="3" align="center" bgcolor="#ffffff">' +
'      <div class="countdown">' +
'        <div class="countdown-time">{finishDateNum}</div>' +
'      </div></td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td>开工日期</td>' +
'    <td width="45"><span id="buildStart"  name="buildStart" >{buildStart}</span></td>' +
'    <td width="20">年</td>' +
'    <td width="30"><span id="buildStartMonth"  name="buildStartMonth" >{buildStartMonth}</span></td>' +
'    <td width="30">月</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td>预计完工日期</td>' +
'    <td width="45"><span id="buildEnd"  name="buildEnd" >{buildEnd}</span></td>' +
'    <td>年</td>' +
'    <td width="30"><span id="buildEndMonth"  name="buildEndMonth" >{buildEndMonth}</span></td>' +
'    <td>月</td>' +
'    <td>&nbsp;</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr>' +
'    <td colspan="11" height="4%"></td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td width="132">概算总金额</td>' +
'    <td width="95" colspan="3"><span id="bdgTotalMoney"  name="bdgTotalMoney" >{bdgTotalMoney}</span></td>' +
'    <td width="30">万元</td>' +
'    <td>&nbsp;</td>' +
'    <td width="132">合同签订总金额</td>' +
'    <td width="95"><span id="conTotalMoney" name="conTotalMoney" >{conTotalMoney}</span></td>' +
'    <td width="30">万元</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td>本年投资完成</td>' +
'    <td colspan="3"><span id="yearTzTotalMoney"  name="yearTzTotalMoney" >{yearTzTotalMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>累计投资完成</td>' +
'    <td><span id="allTzTotalMoney" name="allTzTotalMoney" >{allTzTotalMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td>本年付款金额</td>' +
'    <td colspan="3"><span id="yearTotalPayMoney"  name="yearTotalPayMoney" >{yearTotalPayMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>累计付款金额</td>' +
'    <td><span id="allTotalPayMoney" name="allTotalPayMoney" >{allTotalPayMoney}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="12%">' +
'    <td>&nbsp;</td>' +
'    <td>本月资金到位</td>' +
'    <td colspan="3"><span id="monthMoneyIn"  name="monthMoneyIn" >{monthMoneyIn}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'    <td>累计资金到位</td>' +
'    <td><span id="allTotalMoneyIn"  name="allTotalMoneyIn" >{allTotalMoneyIn}</span></td>' +
'    <td>万元</td>' +
'    <td>&nbsp;</td>' +
'  </tr>' +
'  <tr height="12%" id="prjQualityTarget" style="display:block">' +
'    <td>&nbsp;</td>' +
'    <td width="132">项目质量总目标</td>' +
'    <td colspan="7"><span id="prjQualityTarget" name="prjQualityTarget" style="font-size:12px;text-align:left;" >&nbsp;{prjQualityTarget}</span></td>' +
'  </tr>' +
'  <tr>' +
'    <td colspan="11" height="10"></td>' +
'  </tr>' +
'  <tr height="40">' +
'    <td>&nbsp;</td>' +
'    <td colspan="9"><p class="kaohe">上月数据完整性考核分数 <u style="color:red;cursor:pointer;" onclick="openNum()">&nbsp;&nbsp;{lastMonthNum}&nbsp;&nbsp;</u>&nbsp;&nbsp;分</p></td>' +
'    <td>&nbsp;</td>' +
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
  {id: 'titleText', type: 'string'},    //修改完工与否的标题
  {id: 'finishDateNum', type: 'integer'},//离完工还有天数
  {id: 'conTotalMoney', type: 'double'},//合同签订总金额
  {id: 'allTzTotalMoney', type: 'double'},//自开工累计投资完成
  {id: 'allTotalPayMoney', type: 'double'},//自开工累计付款金额
  {id: 'allTotalMoneyIn', type: 'double'},//自开工累计自己到位
  {id: 'lastMonthNum',  type: 'double'}//上月数据完整性考核分数
]
var inputData1 = {};
var getQualityTarget = '';
DWREngine.setAsync(false);
pcPrjService.getProItemIndexData(CURRENTAPPID,function(list){
	list[0].investScale = (list[0].investScale).toFixed(0);
	list[0].bdgTotalMoney=(list[0].bdgTotalMoney).toFixed(0);
	list[0].yearTzTotalMoney = (list[0].yearTzTotalMoney).toFixed(0);
//	list[0].yearTotalPayMoney = (list[0].yearTotalPayMoney).toFixed(0);
//	list[0].monthMoneyIn = (list[0].monthMoneyIn).toFixed(0);
	list[0].allTzTotalMoney = (list[0].allTzTotalMoney).toFixed(0);
	list[0].conTotalMoney = (list[0].conTotalMoney).toFixed(0);
	list[0].allTotalPayMoney = (list[0].allTotalPayMoney).toFixed(0);
	list[0].allTotalMoneyIn = (list[0].allTotalMoneyIn).toFixed(0);
	getQualityTarget =  list[0].prjQualityTarget;
	inputData1 = list[0]
})
DWREngine.setAsync(true);

//折线图
//火电项目14个里程碑节点
//风电项目7个里程碑节点
//其他项目根节点的下一个层级节点
var liInitData = {};
var eastTable =
	'<div id="liTable">' +
	'<div id="myChart"></div>' +
	'<table width="98%" id="liListTable" height="100%" align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="5" style="display:none">' +
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
	'<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="10" class="buttons">' +
	'  <tr>' +
	'    <td align="center"><input value="项目基本信息" type="button" id="prjAct" name="prjAct" onClick="event(this)"></td>' +
	'    <td align="center"><input value="合同动态管理台账" type="button" id="con" name="con" onClick="event(this)"></td>' +
	'    <td align="center"><input value="概算动态执行监控" type="button" id="bdgAct" name="bdgAct" onClick="event(this)"></td>' +
	'    <td align="center"><input value="合同执行情况报表" type="button" id="conAct" name="conAct" onClick="event(this)"></td>' +
	'    <td align="center"><input value="招投标汇总查询" type="button" id="bidCon" name="bidCon" onClick="event(this)"></td>' +
	'  </tr>' +
	'  <tr>' +
	'    <td align="center"><input value="投资完成月报汇总查询" type="button" id="gzwc" name="gzwc" onClick="event(this)"></td>' +
	'    <td align="center"><input value="进度情况月报汇总查询" type="button" id="jdgk" name="jdgk" onClick="event(this)"></td>' +
	'    <td align="center"><input value="质量验评月报汇总查询" type="button" id="zlgk" name="zlgk" onClick="event(this)"></td>' +
	'    <td align="center"><input value="监理报告汇总查询" type="button" id="jlbg" name="jlbg" onClick="event(this)"></td>' +
	'    <td align="center"><input value="项目信息维护" type="button" id="prjWh" name="prjWh" onClick="event(this)"></td>' +
	'  </tr>' +
	'</table>' +
	'';


var chart;

//上半部高度
var partHeight = 397;
//折线图宽度固定
var eastWidth = 515;
if(screenWidth>1024) eastWidth = (screenWidth/2)+50;
//项目基本信息宽度
var centerWidth = 500;
//整个宽度
var allWidth = parseInt(eastWidth) + parseInt(centerWidth);

Ext.onReady(function(){
	var centerPanel =  new Ext.Panel({
		region: 'center',
        border : false,
		width : centerWidth,
		height : partHeight
	});
	var eastPanel =  new Ext.Panel({ 
		region: 'east',
        border : false,
		width : eastWidth,
		height : partHeight
	});
	
	var southPanel =   new Ext.Panel({ 
        border: false,
		region: 'center',
        bodyStyle : 'border-top:1px solid #eee',
		width : allWidth
	});
      
	var panel = new Ext.Panel({
		height : partHeight,
		width : allWidth,
		layout : 'border',
		region: 'north',
		border : false,
		items : [centerPanel,eastPanel]
	});
	
	var allPanel = new Ext.Panel({
		layout : 'auto',
		border : false,
		autoScroll : true,
		width : allWidth,
		items : [panel,southPanel]
	})

	var viewport = new Ext.Viewport({
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
	//viewXtp2.overwrite(eastPanel.body, null);
	var viewXtp3 = new Ext.XTemplate(southTable);
	viewXtp3.overwrite(southPanel.body, '');
	
	
	//参数依次为：swf文件、组件ID、宽度、高度、背景颜色、是否缩放
    //缩放参数：0图形不随容器大小变化，1图形随容器大小等比例缩放
    chart = new Carton("/"+ROOT_CHART+"/XCarton.swf", "ChartId", "700", "100%", "#FFFFFF", "1");
    chart.render("myChart");
    chart.setParam("projectuid",projectuid);
    //读取服务器端的配置文件，根据不同项目类型读取不同cml文件
    //包括风电，火电，其它类别
    if(itemType == "HD"){
    	chart.setDataURL("PCBusiness/cml/myChartHD.cml");
    }else if(itemType == "HDX"){
		//火电项目新里程碑图，6条水平的线表示1#，2#，公共部分计划与完成 pengy 2014-2-20
    	chart.setDataURL("PCBusiness/cml/myChartHDNew.cml");
    }else if(itemType == "FD"){
    	chart.setDataURL("PCBusiness/cml/myChartFD.cml");
    }else{
    	chart.setDataURL("PCBusiness/cml/myChartXX.cml");
    }
    
    
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
		southPanel.setHeight(100 - 9);
		panel.setHeight(allPenelHeight - 100 - 9);
		allPanel.setHeight(allPenelHeight);
	}
	
	//调整里程碑名称table高度
	var liListTable = document.getElementById("liListTable");
	var flexHeight = document.getElementById("myChart").offsetHeight;
	var eastPanelHeight = eastPanel.getInnerHeight();
	liListTable.setAttribute("height",eastPanelHeight-flexHeight-20);
	liListTable.setAttribute("height",eastPanelHeight-flexHeight-20);
	
	if(getQualityTarget == null){
		document.getElementById('prjQualityTarget').style.display = 'none';
	}else{
		document.getElementById('prjQualityTarget').style.display = 'block';
	}
	
	allPanel.on("bodyresize",function(){
		var buttonHeight = 100;
		if(screenWidth > 1024){
			//调整宽度
			var allPenelWidth = allPanel.getInnerWidth();
			eastWidth = (screenWidth/2)+50;
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
    
	if(_ct_tool){
	    _ct_tool.addClass('x-toolbar-pro');
	}
	window.onunload = function(){
	    if(_ct_tool){
		    _ct_tool.removeClass('x-toolbar-pro');
	    }
	}
    
});



	function openNum(){
		//var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
		window.showModalDialog(
			BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp?view=1&pid=" + CURRENTAPPID,
			"","dialogWidth:980px;dialogHeight:450px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
	}
	   function event(btn){
			   var aw = 1024,ah = 768;
			   var type="";
			   try{
					ah = screen.availHeight;
					aw = screen.availWidth;
				}catch(e){}
			   var btnId =  btn.id;
			   var scheduleURL ="";
			   if(btnId=="prjAct"){
			   	      type ="执行情况";
			   	      aw = aw>1200?1200:(aw<=1024?1024:aw);
		              ah = ah>520?520:ah;
			          scheduleURL = BASE_PATH+"PCBusiness/zhxx/query/pc.zhxx.search.detail.jsp?flag=unBtn";//项目执行过程概览
			   }else if(btnId =="con"){
			   	      type = "合同动态管理台账";
			          scheduleURL = BASE_PATH+"PCBusiness/pcCon/pc.con.info.report.jsp"; //合同动态管理台账
			   }else if(btnId=="bdg"){
			   	      type = "概算动态管理台账"
			          scheduleURL =BASE_PATH +"PCBusiness/budget/bdgEntry/pc.bdg.info.report.jsp";//概算动态管理台账
			   }else if(btnId=="bdgAct"){
			          scheduleURL = BASE_PATH +"Business/budget/bdg.frame.edit.default.jsp?indexView=1&getPid="+CURRENTAPPID+"";//概算动态执行监控
			   }else if(btnId=="conAct"){
			          scheduleURL = BASE_PATH +"PCBusiness/report/pc.con.report.jsp"  //合同执行情况报表
			   }else if(btnId == "bidCon"){
			          scheduleURL = BASE_PATH +"PCBusiness/bid/pc.bid.comp.query.jsp?pid="+CURRENTAPPID+"" //招投标汇总查询
			   }else if(btnId == "gzwc"){
			   	      type = '';
			          scheduleURL =BASE_PATH + "PCBusiness/tzgl/query/pc.tzgl.monthInvest.report.jsp"; //投资完成月报汇总查询
			   }else if(btnId == "zlgk"){
			   		  type="";
			          scheduleURL =BASE_PATH +"PCBusiness/zlgk/pc.zlgk.comp.gcjd.jsp";                //质量验评月报汇总查询
			   }else if(btnId == "jlbg"){
			          scheduleURL = BASE_PATH + "PCBusiness/zlgk/pc.zlgk.input.supervison.jsp?lvl=6&pid="+CURRENTAPPID+"";        // 监理报告汇总查询
			   }else if(btnId=="jdgk"){
			   	      type = "";
			          scheduleURL = BASE_PATH + "PCBusiness/jdgk/pc.jdgk.index.gcjd.jsp";       //进度情况月报汇总查询
			   }else if(btnId=="prjWh"){
			   	      type = "";
			          scheduleURL = BASE_PATH + "PCBusiness/zhxx/baseInfoInput/pc.zhxx.projinfo.baseinfo.addOrUpdate.jsp";       //项目信息维护
			   }
			   window.showModalDialog(scheduleURL,type,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
							"resizable:yes;Minimize:no;Maximize:yes");
	   }
       
if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(true);
}