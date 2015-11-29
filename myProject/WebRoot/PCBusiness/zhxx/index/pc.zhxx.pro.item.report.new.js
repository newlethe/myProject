if (parent.CT_TOOL_DISPLAY) {
	parent.CT_TOOL_DISPLAY(false);
}
if (parent.wanyuan) {
	parent.wanyuan.setText('');
}

var _reg = /,/g // 正则表达式
var sqlPid = USERPIDS.replace(_reg, "','");
sqlPid = "('" + sqlPid + "')";

Ext.onReady(function() {

	var projDS = new PC.Store({
		baseParams : {
			ac : 'list',
			bean : "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo",
			business : "baseMgm",
			method : "findWhereOrderby",
			params : "pid in" + sqlPid
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "pid"
		}, [{
			name : 'pid',
			type : 'string'
		}]),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	var _columns = [{
		header:'项目基本情况报表',dataIndex:'yiUid',width:100,align:'center',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				var prjName = record.get("prjName");
				return "<a href='javascript:openReport(\"project\",\""+value+"\",\""+pid+"\",\""+prjName+"\")'>查看</a>";
			}	
		},
		{header:'投资完成情况表',dataIndex:'monthUid',width:100,align:'center',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				var prjName = record.get("prjName");
				return "<a href='javascript:openReport(\"complete\",\""+value+"\",\""+pid+"\",\""+prjName+"\")'>查看</a>";
			}	
		},
		{header:'待摊费用报表',dataIndex:'weekReport',width:90,align:'center',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				var prjName = record.get("prjName");
				return "<a href='javascript:openReport(\"dtfy\",\""+value+"\",\""+pid+"\",\""+prjName+"\")'>查看</a>";
			}	
	}];

	var toolbar = [];
	if (ModuleLVL == '1'){
		toolbar = [{
				id : 'auditBtn',
				text : '审核',
				menu : [{
					id : 'tzwc',
					text : '投资完成情况表审核',
					handler : function(){
						openAudit("tzwc");
					}
				},{
					id : 'xmjb',
					text : '项目基本情况表审核',
					handler : function(){
						openAudit("xmjb");
					}
				}]
			}]
	};
	
	var p = new PC.ProjectStatisGrid({
		tbar : toolbar,
		prjRenderer : function(value, meta, record, store) {
			var pid = record.get('pid');
			var pname = record.get('prjName');
			return "<a href=javascript:loadFirstModule('" + pid
					+ "','" + pname + "')>" + value + "</a>";
		},
		ds : projDS,
		columns : _columns,
		viewConfig : {
			forceFit : false
		},
		searchHandler : function(store, unitid, projName) {
			systemMgm.getPidsByUnitid(unitid, function(list) {
				var unit_pids = "";
				for (var i = 0; i < list.length; i++) {
					unit_pids += ",'" + list[i].unitid + "'";
				}
				if (unit_pids.length == "")
					unit_pids = "('')";
				else
					unit_pids = "(" + unit_pids.substring(1) + ")";

				if (projName == null || projName == "") {
					if (unitid == null || unitid == "") {
						store.baseParams.params = "pid in" + sqlPid;
					} else {
						store.baseParams.params = "pid in" + unit_pids;
					}
				} else {
					if (unitid == null || unitid == "") {
						store.baseParams.params = "pid in" + sqlPid
							+ " and prj_name like '%" + projName + "%'";
					} else {
						store.baseParams.params = "pid in" + unit_pids
							+ " and prj_name like '%" + projName + "%'";
					}
				}
				store.load();
			});
		}
	});

	new Ext.Viewport({
		layout : 'fit',
		items : [p]
	})
	// 隐藏字段
	p.getColumnModel().setHidden(3, true);
	p.getColumnModel().setHidden(6, true);
	p.getColumnModel().setHidden(7, true);
	projDS.load();

	function openAudit(str){
		var record = p.getSelectionModel().getSelected();
		if (null == record || record == 'undefined'){
			Ext.example.msg("提示", "请先选择一个项目！");
			return;
		}
		var pid = record.get("pid");
		var prjName = record.get("prjName");
		openReport(str,'',pid,prjName);
	}
});

function openReport(p,uid,pid,pname){
	var powername = "项目基本情况表";
	switch(p){
		case "complete" :
			powername = "投资完成情况表";
			break;
		case "dtfy" :
			powername = "待摊费用报表";
			break;
		case "tzwc" :
			powername = "投资完成情况表审核";
			break;
		case "xmjb" :
			powername = "项目基本情况表审核";
			break;
	}

	DWREngine.setAsync(false);
	switchoverProj(pid,pname);
	DWREngine.setAsync(true);
	parent.lt.expand();
	parent.proTreeCombo.show();
	parent.proTreeCombo.setValue(CURRENTAPPID);
	parent.backToSubSystemBtn.show();
	parent.pathButton.setText("<b>当前位置:"+parent.selectedSubSystemName+"/"+powername+"</b>")
	var url = "/PCBusiness/zhxx/report/pc.pro.base.info.report.input.jsp";
	if (p == "complete"){
		url = "/PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.month.invest.input.jsp";
	} else if (p == "dtfy"){
		url = "/jsp/messageCenter/search/com.fileManage.upload.query.jsp?rootId=201412160953277190531&canReport=1";
	} else if (p == "tzwc"){
		url = "/PCBusiness/tzgl/query/pc.tzgl.input.month.invest.query.jsp";
	} else if (p == "xmjb"){
		url = "/PCBusiness/zhxx/report/pc.pro.base.info.report.input.jsp?dydaView=true&lvl=" + ModuleLVL;
	}
	parent.frames["contentFrame"].location.href = CONTEXT_PATH + url;
}

window.onunload = function() {
	if (parent.ct_tool) {
		parent.ct_tool.el.parent().dom.style.display = 'block';
	}
}