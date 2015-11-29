var _reg=/,/g    //正则表达式
var sqlPid=USERPIDS.replace(_reg,"','");
	sqlPid="('"+sqlPid+"')";
Ext.onReady(function (){
    var projDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params:"pid in"+sqlPid
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "pid"
        }, [
        	{name: 'pid', type: 'string'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	
	var _columns = [{
        	header:'项目执行',
        	dataIndex: "uids",
        	width:70,
        	align:'center',
           	renderer:function(v,meta,record,store){
           		return "<img src='" + BASE_PATH +
           		 "/jsp/res/images/zhxx_welcome/projectSchedule.png' onclick='performance(\""+record.get("pid")+"\",\""+record.get("prjName")+"\",\"执行情况\")'>";
           	}
        },{
        	header:'合同台账',
        	dataIndex:"uids",
        	width:70,
        	align:'center',
        	renderer:function(v,meta,record,store){
        		return "<img src='" + BASE_PATH +
        		 "/jsp/res/images/zhxx_welcome/conReport.png' onclick='performance(\""+record.get("pid")+"\",\""+record.get("prjName")+"\",\"合同动态管理台账\")'>";
        	}
        },{
        	header:'概算台账',
        	dataIndex:"uids",
        	width:70,
        	align:'center',
        	renderer:function(v,meta,record,store){
        		return "<img src='" + BASE_PATH +
        		 "/jsp/res/images/zhxx_welcome/bdgReport.png' onclick='performance(\""+record.get("pid")+"\",\""+record.get("prjName")+"\",\"概算动态管理台账\")'>";
        	}
        },{
        	header:'工程进展',
        	dataIndex:"uids",
        	width:70,
        	align:'center',
        	renderer:function(v,meta,record,store){
        		return "<img src='" + BASE_PATH +
        		 "/jsp/res/images/zhxx_welcome/processReport.png' onclick='performance(\""+record.get("pid")+"\",\""+record.get("prjName")+"\",\"工程进展情况\")'>";
        	}
        },{
        	header:'投资完成',
        	dataIndex:"uids",
        	width:70,
        	align:'center',
        	renderer:function(v,meta,record,store){
        		return "<img src='" + BASE_PATH +
        		 "/jsp/res/images/zhxx_welcome/investComp.png' onclick='performance(\""+record.get("pid")+"\",\""+record.get("prjName")+"\",\"投资完成\")'>";
        	}
        }
	]
	
	var panel = new PC.ProjectStatisGrid({
		prjRenderer:function(value,meta,record,store){
			var select_pid = record.get("pid");
			return "<a href='javascript:loadFirstModule(\""+select_pid+"\",\""+value+"\")' title='"+'xxxxx'+"'>"+value+"</a>"
		},
		ds:projDS,
		columns:_columns,
		region : 'center',
		viewConfig: {
	        forceFit: true
	    },
		searchHandler:function(store,unitid,projName,unitname){
			if(unitid == '103'){//从其他二级公司页面切换到新兴能源二级公司时，将页面切换到现有的新兴能源首页。 
				top.backToSubSystemBtn.hide();
				parent.pathButton.setText("<b>欢迎进入综合信息管理首页</b>");
			   window.location.replace(BASE_PATH+"PCBusiness/zhxx/index/pc.zhxx.pro.index.jsp?unitid="+unitid); 
			 }
			systemMgm.getPidsByUnitid(unitid,function(list){
				var unit_pids = ""
				for(var i=0;i<list.length;i++){
					unit_pids+=",'"+list[i].unitid+"'";
				}
				if(unit_pids.length=="") 
					unit_pids="('')";
				else
					unit_pids="("+unit_pids.substring(1)+")";
					
				if(projName==null || projName ==""){
					if(unitid==null || unitid==""){
						store.baseParams.params="pid in"+sqlPid;
					}else{
						store.baseParams.params="pid in"+unit_pids;
					}
				}else{
					if(unitid==null || unitid==""){
						store.baseParams.params="pid in"+sqlPid+" and prj_name like '%"+projName+"%'";
					}else{
						store.baseParams.params="pid in"+unit_pids+" and prj_name like '%"+projName+"%'";
					}
				}
				store.load();
				panel.selModel.clearSelections();
			});
			ChartId.setParam("UNITID",unitid);
			ChartId.setParam("UNITNAME",unitname);
		},
		listeners:{
			'render':function(grid){
				
			}
		}
	})
	new Ext.Viewport({
		layout:'border',
		items:[panel,{
			region:'south',
			height:240,
			split:true,
			layout:'border',
			items:[{
				region:'east',
				width:240,
				title:'我关注的内容',
				split:true,
				collapsible :true,
				collapsed : false,
				html:'<div id="msg" style="height:100%"></div>'
			},{
				region:'center',
				layout:'fit',
				html:'<div id="myChart" style="height:100%"></div>'
			}]
		}]
	})
	//projDS.load();
	//参数依次为：swf文件、组件ID、宽度、高度、背景颜色、是否缩放(缩放参数：0图形不随容器大小变化，1图形随容器大小等比例缩放)
    chart = new Carton("/XCarton/XCarton.swf", "ChartId", "100%", "100%", "#FFFFFF", "1");
    chart.render("myChart");
    chart.setDataURL("PCBusiness/cml/zhxx.cml");
	
	if(edit_unitid != ""){
			top.backToSubSystemBtn.setText("返回首页");
			top.backToSubSystemBtn.show();
	
			panel.treeCombo.setValue(edit_unitid);
			panel.treeCombo.setRawValue(edit_unitname);
			
			systemMgm.getPidsByUnitid(edit_unitid,function(list){
				var unit_pids = ""
				for(var i=0;i<list.length;i++){
					unit_pids+=",'"+list[i].unitid+"'";
				}
				if(unit_pids.length=="") 
					unit_pids="('')";
				else
					unit_pids="("+unit_pids.substring(1)+")";
					
				projDS.baseParams.params="pid in "+unit_pids+"";
				projDS.load({
					callback:function(){
						chart.setParam("UNITID",edit_unitid);
						chart.setParam("UNITNAME",edit_unitname);
					}
				});
			});
	}else{
		chart.setParam("UNITID",USERBELONGUNITID);
		chart.setParam("UNITNAME",USERBELONGUNITNAME);
		projDS.load();
	}
	//setInterval("setSWFParams(ChartId)",1000);
	loadMsg();
	/*if(panel.selModel){
		panel.selModel.on('rowselect',function(selMl, rowIndex, rec ){
			ChartId.setParam("UNITID",rec.get('pid'));
			ChartId.setParam("UNITNAME",rec.get('prjName'));
		})
	}*/
});

function loadMsg(){
	var tpl = new Ext.Template(
				'<div class="bq">',
			    '<a href="javascript:openTaskWindow()" class="tb01">您目前有<span>{unFlow}</span>条待办事项未处理</a>',
	  			'<a href="javascript:openMsgWindow()" class="tb02">您目前有<span id="msgNum">{unMsg}</span>条信息未阅读</a>',
	  			'<a href="javascript:jumpToWarnInfo()" class="tb02">共有<span id="warnCount">{warnCount}</span>条预警信息</a>',
	  			'<a href="javascript:openDynamicdataWindow()" class="tb02"><span id="dynamicData">本月业务数据动态概览</span></a>	</div>'
			 )
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
		})
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
				tpl.overwrite('msg',o);
			});
         }
         else if(publishUrl&&!uploadUrl){//有发布消息查看权限
         	var rootId=getRootId(publishUrl);
			ComFileManageDWR.getUnreadMsgNumPublish(USERID, USERDEPTID,rootId,function(retVal){
				o.unMsg = retVal;
				tpl.overwrite('msg',o);
			});          	
         }
         else if(!publishUrl&&uploadUrl){//有上报消息查看权限
         	var rootId=getRootId(uploadUrl);
			ComFileManageDWR.getUnreadMsgNumUpload(USERID, USERDEPTID,rootId,function(retVal){
				o.unMsg = retVal;
				tpl.overwrite('msg',o);
			});          	
         }  
         else if(!publishUrl&&!uploadUrl){//发布与消息模块查看权限都没有
				o.unMsg = 0;
				tpl.overwrite('msg',o);         	
         }   		
	DWREngine.setAsync(true);
	tpl.overwrite('msg',o);
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
	
			getUnreadNum();
		});
	}
function getUnreadNum(){
	var publishUrl='';
	var uploadUrl='';
		DWREngine.setAsync(false);
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
				document.getElementById('msgNum').innerHTML = retVal;
			});
         }
         else if(publishUrl&&!uploadUrl){//有发布消息查看权限
         	var rootId=getRootId(publishUrl);
			ComFileManageDWR.getUnreadMsgNumPublish(USERID, USERDEPTID,rootId,function(retVal){
				document.getElementById('msgNum').innerHTML = retVal;
			});          	
         }
         else if(!publishUrl&&uploadUrl){//有上报消息查看权限
         	var rootId=getRootId(uploadUrl);
			ComFileManageDWR.getUnreadMsgNumUpload(USERID, USERDEPTID,rootId,function(retVal){
				document.getElementById('msgNum').innerHTML = retVal;
			});          	
         }  
         else if(!publishUrl&&!uploadUrl){//发布与消息模块查看权限都没有
			document.getElementById('msgNum').innerHTML = 0;       	
         }            
		DWREngine.setAsync(true);		
}
function downloadfile(pid,biztype){
	var param = {
		businessId:pid,
		businessType:biztype
	};
	showMultiFileWin(param);
}

function performance(pid,pname,type){
	switchoverProj(pid,pname);
	var aw = 1024,ah = 768;
	try{
		ah = screen.availHeight;
		aw = screen.availWidth;
	}catch(e){}
	
	if(type=="执行情况"){
		aw = aw>1200?1200:(aw<=1024?1024:aw);
		ah = ah>480?480:ah;
		
		var scheduleURL = BASE_PATH+"PCBusiness/zhxx/schedule/projectSchedule.jsp";
		window.showModalDialog(scheduleURL,type,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;" +
				"status:no;center:yes;resizable:no;Minimize:no;Maximize:no;");
		
	}else if(type=="合同动态管理台账"){
		var conRepURL =  BASE_PATH+"PCBusiness/pcCon/pc.con.info.report.jsp";
		window.showModalDialog(conRepURL,type,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
				"resizable:yes;Minimize:no;Maximize:yes");
	}else if(type=="概算动态管理台账"){
		var URL =  BASE_PATH+"PCBusiness/budget/bdgEntry/pc.bdg.info.report.jsp";
		window.showModalDialog(URL,	type,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
				"resizable:yes;Minimize:no;Maximize:yes");
	}else if(type=="工程进展情况"){
		var url = BASE_PATH+"PCBusiness/jdgk/pc.jdgk.index.gcjd.jsp";
		window.showModalDialog(url,null,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
				"resizable:yes;Minimize:no;Maximize:yes");
	}else if(type=="投资完成"){
		var monthInvestURL = BASE_PATH+"PCBusiness/tzgl/query/pc.tzgl.monthInvest.report.jsp";
		window.showModalDialog(monthInvestURL,null,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
				"resizable:yes;Minimize:no;Maximize:yes");
	}
};
