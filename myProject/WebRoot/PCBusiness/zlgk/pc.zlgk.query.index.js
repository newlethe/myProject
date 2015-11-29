// 质量管理信息输入主界面JS
var _reg = /,/g // 正则表达式
var sqlPid = USERPIDS.replace(_reg, "','");
sqlPid = "('" + sqlPid + "')";
var primaryKey = "uids";
var listMethod = "getSjtype";
var listMethod2 = "getLastedReportName";

var sjTypes = new Array();      	//获取的办理期别

var latestMonth = "";        	    //最近的月份

var reportNames // 最新监理报告名称
Ext.onReady(function() {
	
	function getsjTypes(){
	var _SQL = "select distinct SJ_TYPE from pc_zlgk_qua_detail order by SJ_TYPE DESC";
	DWREngine.setAsync(false);
	 	baseMgm.getData(_SQL, function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i]);	
			var month = parseInt(list[i].substring(4,6), 10);
			month = "年"+month + "月";
			temp.push(list[i].substring(0,4)+month)
			sjTypes.push(temp);	
	 	}
	 	
	 	//如果返回结果为空
	 	if(sjTypes.length==0)
	 	{
	 		sjTypes[0][0] = 0;
	 	}
	 	});
		DWREngine.setAsync(true);
}
	getsjTypes();
	latestMonth = sjTypes[0][0];
	
	var monthDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : sjTypes
	})
	
//获取监理报告期别
	  	var monthCombo = new Ext.form.ComboBox({
      	name: 'report-month',
		readOnly : true,
		valueField: 'k',
		displayField: 'v', 
		mode: 'local',
        triggerAction: 'all',
        store: monthDs,
        lazyRender: true,
        allowBlank:true,
        listClass: 'x-combo-list-small',
		value:latestMonth,
		width:100,
		listeners:{
			select:function(combo){
				projDS.removeAll();
		      	var month = combo.getValue();
		      	projDS.baseParams.params = "unitid"+SPLITB+USERBELONGUNITID +SPLITA+ "and sjType='"+ month + "'";
		      	projDS.reload();
		    }
		}
    })   
	
	var projDS = new PC.Store({
				baseParams : {
					ac : 'list',
					business: 'zlgkImpl',
//					bean: "com.sgepit.pcmis.zlgk.service.PCApprovlServiceImpl",
					method : listMethod2,
//					params:"unitid"+SPLITB+USERBELONGUNITID   // 默认是集团公司，进入页面有用户可以选择集团公司的项目
					params:"unitid"+SPLITB+USERBELONGUNITID+SPLITA+"sjType"+SPLITB+latestMonth
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
								}, {
									name : 'ljhgl',// 累计验评合格率
									type : 'string'
								}, 
								{
									name : 'byhgl', // 本月验评合格率
									type : 'string'
								}, {
									name : 'ypStatisticalReports',
									type : 'string'
								}, {
									name : 'jlReportList',
									type : 'string'
								}, {
									name : 'reportname',
									type : 'string'
								}]),

				pruneModifiedRecords : true
			});

	var _columns = [{
		header : "累计验评合格率",
		dataIndex : "ljhgl",
		renderer : function(value, meta, record) {
		  var ljhgl = parseFloat(record.get('ljhgl'));
		  if(ljhgl>0)
		  {
		  	return ljhgl*100+"%";
		  }
		  else
		  {
		  	return "未上报";
		  }
		}
	}, {
		header : '本月验评合格率',
		dataIndex : "byhgl",
		width: 200,
		align: 'center',
		renderer : function(value, meta, record) {
		  var byhgl = parseFloat(record.get('byhgl'));
		  if(byhgl>0)
		  {
		  	return byhgl*100+"%";
		  }
		  else
		  {
		  	return "未上报";
		  }
		}
	},{
		header : '验评统计报表',
		dataIndex : "ypStatisticalReports",
		align:'center',
		renderer : function(value, meta, record) {
			// var num = Math.floor(Math.random()*100);
			var pid = record.get('pid');
			var prjName = record.get('prjName');
			return "<a href='javascript:loadFirstModule(\"" + pid + "\",\""
					+ prjName + "\",\"\")'>" + "查看" + "</a>";
		}
	}, {
		header:'监理报告列表',
        	dataIndex: "jlReportList",
        	align:'center',
        	renderer:function(value,meta,record){
        		var pid = record.get('pid');
        		var prjName = record.get('prjName');
        		return "<a href='javascript:jumpToSuper(\"" + pid + "\",\""
					+ prjName + "\",\"\")'>" + "查看" + "</a>";
        	}
	}, {
		header : '最新监理周报',
		dataIndex : "reportname",
		renderer : function(value, meta, record) {
			var pid = record.get('pid');
			var reportName = record.get('reportname');
			var prjName = record.get('prjName');
			return "<a href='javascript:loadFirstModule(\"" + pid + "\",\""
					+ prjName + "\",\"0\")'>" + reportName + "</a>"
		}
	}]

	var p = new PC.ProjectStatisGrid({
				prjRenderer : function(value, meta, record, store) {
					var proNo = record.get("pid");
					var select_pid = record.get("pid");
					var select_prjName = record.get("prjName"); // 在具体选择办理状态时候传值，此处默认为全部
					return "<a href='javascript:loadFirstModule(\""
							+ select_pid + "\",\"" + select_prjName
							+ "\",\"\")'>" + select_prjName + "</a>"
				},
				//title : '<center><b><font size=3>质量信息查询一览表</font></b></center>',
				ds : projDS,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				tbar:['选择月份：&nbsp;',monthCombo,'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'],
				columns : _columns,
				searchHandler : function(store, unitid, projName) {
					store.baseParams.params = "unitid"+SPLITB+USERBELONGUNITID+SPLITA+"projName"+SPLITB+projName;
					store.reload();
				}
			})
	projDS.load({
				callback : function() {
					// alert(projDS.getCount())
				}
			})

	// 指定comboBox选中后处理函数
	p.treeCombo.on('select', appFiterByProject);

	function appFiterByProject(combo) {
		var prjid = combo.getValue();
		projDS.baseParams.params = "pid=" + prjid;
		projDS.reload();
	}
	//	
	new Ext.Viewport({
				layout : 'fit',
				items : [p]
			})

	

});

function jumpToSuper(selPid, selPrjName){
	switchoverProj(selPid, selPrjName);
	parent.frames['contentFrame'].location.href = 
		BASE_PATH +'PCBusiness/zlgk/pc.zlgk.query.supervison.jsp';
}
