

//分辨率宽度和高度
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;


var defSpace= 40;
//消息框默认高度
var defInfoHeight = 60;
//动态调整地图宽度
var mapChangeWidth = 0;
//地图图片高度
var mapHeight = 500;

if(screenWidth > 1024) mapChangeWidth = 20
var mapTitleHeight = 0;
var itemListPartWidth = 0;
var monthCombo = parent.indexChangeMonth;
var monthText = parent.yearMonthText;
var monthData = parent.dsCombo_yearMonth;
var newUnitCombo  = parent.unitCombo;
var newUnitComboText = parent.unitComboText;
var pathButton = parent.pathButton;
var wanyuan = parent.wanyuan;
var _ct_tool = parent.ct_tool;
	var tpl = 
		'<div id="proInfo" style="background:#fff;">' +
		'<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="1" id="infoTable" style="height:100%">' +
		'  <tr>' +
		'    <td bgcolor="#ffffff">&nbsp</td>' +
		'    <td width="150">&nbsp;</td>' +
		'    <td width="90"></td>' +
		'    <td width="30"></td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td width="150"></td>' +
		'    <td width="90"></td>' +
		'    <td width="30"></td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'  <tr>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>在建发电项目</td>' +
		'    <td align="center"><span id="prjNum1">{prjNum1}</span></td>' +
		'    <td>个</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>在建非电项目</td>' +
		'    <td align="center"><span id="prjNum2">{prjNum2}</span></td>' +
		'    <td>个</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'  <tr>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>发电项目总装机容量</td>' +
		'    <td align="center"><span id="totalCapacity">{totalCapacity}</span></td>' +
		'    <td>MW</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>非电项目概算总金额</td>' +
		'    <td align="center"><span id="bdgTotalMoney2">{bdgTotalMoney2}</span></td>' +
		'    <td>万元</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'  <tr>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>发电项目概算总金额</td>' +
		'    <td align="center"><span id="bdgTotalMoney1">{bdgTotalMoney1}</span></td>' +
		'    <td>万元</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>&nbsp;</td>' +
		'    <td>&nbsp;</td>' +
		'    <td>&nbsp;</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'  <tr>' +
		 '   <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'  <tr>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>本年投资完成总金额</td>' +
		'    <td align="center"><span id="yearTzTotalMoney">{yearTzTotalMoney}</span></td>' +
		'    <td>万元</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>本月投资完成总金额</td>' +
		'    <td align="center"><span id="monthTzTotalMoney">{monthTzTotalMoney}</span></td>' +
		'    <td>万元</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'  <tr>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>本年累计付款金额</td>' +
		'    <td align="center"><span id="yearTotalPayMoney">{yearTotalPayMoney}</span></td>' +
		'    <td>万元</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td>本月付款金额</td>' +
		'    <td align="center"><span id="monthTotalPayMoney">{monthTotalPayMoney}</span></td>' +
		'    <td>万元</td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'  <tr>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td></td>' +
		'    <td bgcolor="#ffffff">&nbsp;</td>' +
		'  </tr>' +
		'</table>' +
		'</div>' +
		'';
		
	var initData = {};
	
	var tplRemind = 
		'<div id="remindInfo" style="background:#fff;">' +
        '<div id="close_remind" style="display:none;" onclick="changeMyRemind()">×</div>' +
		'<div id="table_remind" style="display:none;">' +
        '   <ul>'+
		'    <li><a href="javascript:openTaskWindow();">您目前有<span id="unFlow">{unFlow}</span>条待办事项未处理</a></li>' +
		'    <li style="display:none;"><a href="javascript:jumpToWarnInfo();">共有<span id="warnCount">{warnCount}</span>条预警信息</a></li>' +
		'    <li><a href="javascript:openMsgWindow();">您目前有<span id="msgNum">{unMsg}</span>条信息未阅读</a></li>' +
		'    <li><a href="javascript:openDynamicdataWindow();"><span id="dynamicData">本月业务数据动态概览</span></a></li>' +
        '   </ul>'+
        '</div>'+
        '<div id="show_remind" style="display:display;" onclick="changeMyRemind()">我关注的内容</div>' +
		'</div>' +
		'';
	var remindTpl = new Ext.XTemplate(tplRemind);

	var tplMap = 
		'<div id="right">' +
		'  <div id="mapFrame">' +
		'		<tpl for="citymap">' +
				'    <div id="city{city}" class="unitPoint" style="top: {citytop}px; right: {cityright+'+(mapChangeWidth/2)+'}px;" onmouseover="showInfo(\'city{city}\',\'info{city}\',\'show\')"></div>' +
				'    <div id="info{city}" class="unitPointInfo" style="display:none; " onmouseover="showInfo(\'city{city}\',\'info{city}\',\'show\')" onmouseout="showInfo(\'city{city}\',\'info{city}\',\'hide\')">' +
				'      <div class="mapInfoTop"></div>' +
				'      <div class="mapInfoBody">' +
						'		<tpl for="infolist">' +
							'      <a style="color:{color};" href="javascript:loadFirstModuleFromMap(\'{pid}\',\'{name}\',\'{prjtype}\');" class="infoUnit">{shortname}</a><br>' +
						'		</tpl>' +
				'      </div>' +
				'      <div class="mapInfoFoot"></div>' +
				'	</div>' +
		'		</tpl>' +
		'    <div id="mapPng" style="background:#fff;"><img src="PCBusiness/zhxx/index/images/map2014.jpg" id="mapimg" height="'+mapHeight+'" /> </div>' +
		'  </div>' +
		'  <div id="itemListPart">' +
		'  <div id="itemListTitle">' +
        '   <span id="ing" onclick="itemTab(this.id)" style="background:#fff;color:#000;">在建项目</span>' +
        '   <span id="over" onclick="itemTab(this.id)" style="background:#D00F14;color:#fff;">已竣工项目</span>' +
        '  </div>' +
		'  <div id="itemList">' +
		'    <ul id="build_ing" style="display:block;">' +
		'		<tpl for="unitlist">' +
        '			<li><a class="ilist" href="javascript:loadFirstModuleFromList(\'{pid}\',\'{name}\',\'{prjtype}\');">{shortname}</a></li>' +
		'		</tpl>' +
		'    </ul>' +
		'    <ul id="build_over" style="display:none;">' +
		'		<tpl for="unitlist_over">' +
        '			<li><a class="ilist" href="javascript:loadFirstModuleFromList(\'{pid}\',\'{name}\',\'{prjtype}\');">{shortname}</a></li>' +
		'		</tpl>' +
		'    </ul>' +
		'  </div>' +
		'  </div>' +
		'  <div style="clear:both;"></div>' +
		'</div>' +
		'';
	
	function loadMsg(){
		var taskSql = "select count(*) from task_view where tonode='" + USERID + "' and flag='0'";
		
		//warnSql 找到登陆用户所在二级公司下所有项目单位的预警信息, 并且该预警信息状态为"未处理",或"处理中"(不能为"已关闭")
		/*
		var warnSql = "select count(*) from pc_warn_info "
						+ "where pid in ("
						+ "select unitid from sgcc_ini_unit where unit_type_id = 'A'"
						+ "connect by prior unitid = upunit start with unitid='"+USERBELONGUNITID+"')"
					+ " and warnstatus<>'3'";
		*/
		var warnSql = "select count(pc.uids) from pc_warn_dowith_info p left join pc_warn_info pc on p.warninfoid=pc.uids where  p.dowithperson='" + USERID + "' and pc.uids is not null and p.dowithtype='1'";
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
		baseDao.getDataAutoCloseSes(warnSql, function(list){
			o.warnCount = list[0];
		});
		ComFileManageDWR.getModuleUrlByUserId('发布消息提醒', USERID, function(url) {
        	if(url){
        		publishUrl=url;
        	}
    	}); 
	    ComFileManageDWR.getModuleUrlByUserId('上报消息提醒', USERID, function(url) {
        	if(url){
        		uploadUrl=url;
        	}
         });  
         
         if(publishUrl&&uploadUrl){//两类消息查看权限都存在
         	var rootPublishId=getRootId(publishUrl);
         	var rootUploadId=getRootId(uploadUrl);
			ComFileManageDWR.getUnreadMsgNumTotal(CURRENTAPPID,USERID, USERDEPTID,rootPublishId,rootUploadId,function(retVal){
				o.unMsg = retVal;
				remindTpl.overwrite('msg',o);
			});
         }
         else if(publishUrl&&!uploadUrl){//有发布消息查看权限
         	var rootId=getRootId(publishUrl);
			ComFileManageDWR.getUnreadMsgNumPublish(USERID, USERDEPTID,rootId,function(retVal){
				o.unMsg = retVal;
				remindTpl.overwrite('msg',o);
			});          	
         }
         else if(!publishUrl&&uploadUrl){//有上报消息查看权限
         	var rootId=getRootId(uploadUrl);
			ComFileManageDWR.getUnreadMsgNumUpload(USERID, USERDEPTID,rootId,function(retVal){
				o.unMsg = retVal;
				remindTpl.overwrite('msg',o);
			});          	
         }  
         else if(!publishUrl&&!uploadUrl){//发布与消息模块查看权限都没有
				o.unMsg = 0;
				remindTpl.overwrite('msg',o);         	
         } 
		DWREngine.setAsync(true);
		remindTpl.overwrite('msg',o);
	}

	function jumpToWarnInfo(){
		var url = BASE_PATH+"PCBusiness/warn/dowithmanager/warn.dowith.index.jsp";
		window.location.href=url;
	}
	function openDynamicdataWindow(){
		var url = BASE_PATH+"PCBusiness/dynamicdata/dynamic.data.index.jsp";
		window.location.href=url;
	}
	function openTaskWindow(){
		parent.showTaskWin();
	}
	function openMsgWindow(){
		var msgWin = parent.showMsgWin();
		msgWin.on('hide', function(p){
			loadMsg();
			getUnreadNum();
		});
	}
	function getUnreadNum(){
		ComFileManageDWR.getUnreadMsgNum(USERID, USERDEPTID, function(retVal){
			document.getElementById('msgNum').innerHTML = retVal;
		});
	}
	
	function showInfo(city,list,type){
		var info = document.getElementById(list);
		var show = parent.showMode;
		if(type == 'show'){
			var headerDiv = parent.headerDiv;
			var hh = 0;
			if(headerDiv)
				hh = parent.headerDiv.offsetHeight;
			var p = document.getElementById(city);
			var pidTop = p.style.top;
			var pidRight = p.style.right;
			pidRight = pidRight.substring(0,pidRight.length-2);
			pidTop = pidTop.substring(0,pidTop.length-2); 
			info.style.display = "block";
			var currInfoHeight = info.clientHeight;
			var currInfoTop = info.style.top;
			currInfoTop = currInfoTop.substring(0,currInfoTop.length-2);
			var move = pidTop - (currInfoHeight - defInfoHeight) - defSpace;
			info.style.top = move + "px";
			info.style.right = (pidRight - 5) + "px";
			if(show){
				show.style.display = "block";
				show.innerHTML = info.innerHTML;
				show.style.top = parseInt(move) + parseInt(mapTitleHeight) + parseInt(hh) + 55 + "px";
				show.style.right = parseInt(pidRight) + parseInt(itemListPartWidth) + 20 + "px";
				show.onmouseover = function(){
					show.style.display = "block";
				}
				show.onmouseout = function(){
					show.style.display = "none";
				}
	
				info.style.display = "none";
			}
		}
		if(type == 'hide'){
			info.style.display = "none";
			if(show){
				show.style.display = "none";
			}
		}
	}
	function loadFirstModuleFromList(pid,name,type){
		DWREngine.setAsync(false);
		switchoverProj(pid,name)
		DWREngine.setAsync(true);
		//parent.lt.expand();
		parent.proTreeCombo.show();
		parent.proTreeCombo.setValue(CURRENTAPPID)
		//parent.backToSubSystemBtn.show();
		//parent.pathButton.setText("<b>当前位置:综合统计查询 - 基建项目概况</b>")
		var url = BASE_PATH+"PCBusiness/zhxx/index/pc.zhxx.pro.item.index.jsp";;
		if(type == "GF")
			url = BASE_PATH+"PCBusiness/zhxx/index/pc.zhxx.pro.item.index.gf.jsp";;
		window.location.href = url;
		var show = parent.showMode;
		if(show && show.style.display == "block")
			show.style.display = "none";
	}
    
    function itemTab(id){
        var tab_ing = document.getElementById("ing");
        var tab_over = document.getElementById("over");
        if(id == 'ing'){
            tab_ing.style.background = '#fff';
            tab_ing.style.color = '#000';
            tab_over.style.background = '#D00F14';
            tab_over.style.color = '#fff';
            document.getElementById("build_ing").style.display = 'block';
            document.getElementById("build_over").style.display = 'none';
        }else{
            tab_over.style.background = '#fff';
            tab_over.style.color = '#000';
            tab_ing.style.background = '#D00F14';
            tab_ing.style.color = '#fff';
            document.getElementById("build_ing").style.display = 'none';
            document.getElementById("build_over").style.display = 'block';
        }
    }
    
    function changeMyRemind(){
        var show_remind = document.getElementById("show_remind");
        var close_remind = document.getElementById("close_remind");
        var table_remind = document.getElementById("table_remind");
        var disable = show_remind.style.display;
        show_remind.style.display = disable == 'none' ? 'block' : 'none';;
        table_remind.style.display = disable == 'none' ? 'none' : 'block';;
        close_remind.style.display = disable == 'none' ? 'none' : 'block';;
    }
	
	//解析url得到rootid的值
	function getRootId(url){
		var params="";
		var array=url.split("?");
	    if(array.length>1){
	    	var paramArr = array[1].split("&");
	    	for (i=0; i<paramArr.length; i++) {
	    		if(paramArr[i].indexOf("rootId=")==0) {
	    			params = (paramArr[i].split("="))[1];
	    		}
	    	}
	    }
	    return params;
	}
	
	
	window.onbeforeunload = function(){
		var show = parent.showMode;
		if(show && show.style.display == "block")
			show.style.display = "none";
		if(monthCombo && monthText && monthData && newUnitComboText && newUnitCombo && pathButton && wanyuan){
			newUnitComboText.setVisible(false);
			newUnitCombo.setVisible(false);
			monthCombo.setVisible(false);
			monthText.setVisible(false);
			pathButton.setVisible(false);
			wanyuan.setVisible(false);
		}
	}
	
	var currDate = new Date();
//	var currDate = new Date(Date.parse("2012/01/01")); 
	//获取当前月份
	var currMonth = (currDate.getMonth()+101+"").substring(1);
	//获取上一个月份
	var lastMonth = (currDate.getMonth()+100+"").substring(1);
	var curSjType = currDate.getFullYear() + lastMonth;
	if(lastMonth == "00") curSjType = (currDate.getFullYear()-1) + "12";
	var sj = sjType=="" ? curSjType : sjType;
	
Ext.onReady(function(){

	var panelInfo = new Ext.Panel({
		//title : '在建项目统计',
		region:'center',
		border : false,
        header : false,
		items:[{
			region:'center',
            border : false,
			html:'<div id="myProject" style="height:100%;width:100%;"></div>'
		}]
	});
	var remindPanel = new Ext.Panel({
		title : '我关注的内容',
		region:'south',
		layout : 'border',
		height:160,
        border : false,
        header : false,
		items:[{
			region:'center',
            border : false,
			html:'<div id="msg" style="height:100%;width:100%"></div>'
		}]
	});
	var mapPanelWidth = 518;
	if(screenWidth > 1024) mapPanelWidth = screenWidth/2-50
	var mapPanel = new Ext.Panel({
		id : 'mapPanel',
		title : '项目分布图',
		region:'east',
		width : mapPanelWidth,
        border : false,
        header : false,
		items:[{
			region:'center',
            border : false,
			html:'<div id="myMap" style="height:100%;width:100%"></div>'
		}]
	});
	var leftPanel = new Ext.Panel({
		region:'center',
		layout : 'border',
		border : false,
		items : [panelInfo,remindPanel]
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
        border : false,
        bodyBorder : false,
        header : false,
		items : [leftPanel,mapPanel]
	});
	
	if(monthCombo && monthText && monthData &&  newUnitCombo && newUnitComboText  && pathButton && wanyuan){
		monthData = new Ext.data.SimpleStore({
		    fields: ['k', 'v'],   
		    data: getYearMonthBySjType(null,null)
		});
		if(USERBELONGUNITTYPEID == '2' &&  USERBELONGUNITID == "103"){
		     pathButton.setVisible(true);
		     newUnitComboText.setVisible(false);
		     newUnitCombo.setVisible(false);
		}else{
			 newUnitCombo.setValue("103");
			 pathButton.setVisible(false);
		     newUnitComboText.setVisible(true);
		     newUnitCombo.setVisible(true)
		} 
		monthCombo.setVisible(true);
		monthText.setVisible(true);
		monthCombo.store = monthData;
		monthCombo.setValue(sj);
        newUnitComboText.setVisible(false);
        newUnitCombo.setVisible(false);
        wanyuan.setVisible(false);
	}
    
	DWREngine.setAsync(false);
	pcPrjService.getProIndexData(indexUnitId,sj,function(list){
		initData = list[0];
	});
	var viewTpl = new Ext.XTemplate(tpl);
	viewTpl.overwrite('myProject',initData);
	DWREngine.setAsync(false);

	loadMsg();
	var mapInitData = {};
	
	DWREngine.setAsync(false);
	pcPrjService.getMapUnitInfo(indexUnitId,function(str){
		mapInitData = eval('('+str+')')
	});
	DWREngine.setAsync(true);
	
	var mapTpl = new Ext.XTemplate(tplMap);
	mapTpl.overwrite('myMap',mapInitData);

    resizeBody();
    function resizeBody(){
		var right = document.getElementById("right");
		var mapFrame = document.getElementById("mapFrame");
		var mapPng = document.getElementById("mapPng");
		var itemList = document.getElementById("itemList");
		var itemListPart = document.getElementById("itemListPart");
		var itemListTitle = document.getElementById("itemListTitle");
		var infoTable = document.getElementById("infoTable");
	    
	    
	    
		//地图区域可见高度
		var mapShowHeight = mapPanel.getInnerHeight();
        right.style.height = mapShowHeight ;
		mapTitleHeight = mapPanel.getFrameHeight();
		//宽度调整
		itemListPart.style.width = mapPanel.getInnerWidth() - mapFrame.offsetWidth - 2 - mapChangeWidth + "px";
		itemListPartWidth = itemListPart.offsetWidth;
		mapPng.style.width = mapPanel.getInnerWidth() - itemListPartWidth - 2 - mapChangeWidth + "px"; 
	    //基建信息表格高度
	    infoTable.style.height = mapShowHeight - 200;
    }
    
	//最大最小最列表滚动条控制
	mapPanel.on("bodyresize",function(){
		var minWin = parent.minWinBtn;
		if(minWin){
			minWin.handler = function(){
				parent.hd.expand()
	        	parent.maxWinBtn.show();
	        	parent.minWinBtn.hide();
			}
		}
        resizeBody();
        
		var show = parent.showMode;
		if(show && show.style.display == "block")
			show.style.display = "none";
	});
    
    
    if(_ct_tool){
        _ct_tool.addClass('x-toolbar-pro');
    }
    window.onunload = function(){
        if(_ct_tool){
            _ct_tool.removeClass('x-toolbar-pro');
        }
    }
});
