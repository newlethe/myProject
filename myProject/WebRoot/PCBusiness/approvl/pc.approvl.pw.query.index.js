if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}

var primaryKey = "uids"
var treeCombo;
var orderColumn = 'pid';

var cyType = [];      //产业类型
var buildType = [];   //建设性质 
var prjType = [];     //项目类型  
var gmDanWei = [];    //建设规模单位 
var prjLevel = [];    //项目级别

//项目类型
var dsCombo_prjType=new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: [['','']]
});

//项目等级
var dsCombo_prjLevel=new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: ['','']
});

//获得当前用户对于批文办理查询页面的权限, 将该权限值传递给批文办理查询页面, 确定批文建议的顶部工具栏是否显示按钮
var pageLvl = "";
var forwardURL = 'PCBusiness/approvl/pc.approvl.pw.query.main.jsp';

DWREngine.setAsync(false);
	DWREngine.beginBatch(); 
	
	approvlMgm.getPageLvl(USERID, forwardURL, function(power){  //获取批文办理查询页面权限
		pageLvl = power;
	})
	
   	appMgm.getCodeValue('产业类型',function(list){         //获取产业类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			cyType.push(temp);			
			}
	});
	
   	appMgm.getCodeValue('建设性质',function(list){         //获取建设性质
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			buildType.push(temp);			
			}
	});
	
   	appMgm.getCodeValue('项目类型',function(list){         //获取项目性质
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			prjType.push(temp);			
			}
	});
	
	appMgm.getCodeValue('建设规模单位',function(list){         //获取项目性质
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			gmDanWei.push(temp);			
			}
	});
	
	appMgm.getCodeValue('项目级别',function(list){         //获取项目性质
	for(i = 0; i < list.length; i++) {
		var temp = new Array();	
		temp.push(list[i].propertyCode);		
		temp.push(list[i].propertyName);	
		prjLevel.push(temp);			
		}
	});
	DWREngine.endBatch(); 
DWREngine.setAsync(true);

//加载数据项目级别
dsCombo_prjLevel.loadData(prjLevel);

//加载项目类型
dsCombo_prjType.loadData(prjType);

Ext.onReady(function() {
	//项目类型comboBox
	 var prjTypeCombo = new Ext.form.MultiSelect({
         id:   'prjTypeCombo',
         width:  80,
         store : dsCombo_prjType,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示全部',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
		        r.set(this.checkField, !r.get(this.checkField));
                prjTypeCombo.setValue(this.getCheckedValue());
		},
		listeners: {
			collapse: doQuery
		}
  });
		
	//项目级别comboBox
	var prjLevelCombo = new Ext.form.MultiSelect({
         id:   'prjLevelCombo',
         width:  160,
         store : dsCombo_prjLevel,
         readOnly : true,
         displayField:'v',
         valueField:'k',
         emptyText: '显示全部',
         mode: 'local',
         triggerAction : 'all',
         onSelect : function(r,i){
		        r.set(this.checkField, !r.get(this.checkField));
                prjLevelCombo.setValue(this.getCheckedValue());
		},
		listeners: {
			collapse: doQuery
		}
  });
	
	//导出为excel文档按钮
	var exportExcelBtn = new Ext.Button({
			id : 'export',
			text : '导出数据',
			tooltip : '导出数据到Excel',
			cls : 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/page_excel.png',
			handler : function() {
				exportDataFile();
			}
		});
		
	unitTree=_createUniteTree(defaultOrgRootID);
	
	unitTree.on('select',function(combo){
			var dwId = combo.getValue(); //这里的单位ID有可能是前期项目的项目编号
			var projName = pName.getValue();
			if(projName=='')
			{
				prjDs.baseParams.params="unitid" + SPLITB + dwId;
			}
			else
			{
				prjDs.baseParams.params="unitid" + SPLITB + dwId+ SPLITA + "projName" + SPLITB + projName;;
			}
//				prjDs.load({params:{start:0,limit:20}});
			prjDs.load();
	});
	
	//查询按钮
	var queryBtn = new Ext.Button({
		id: 'query',
		text: '查询',
		iconCls: 'form',
		handler: doQuery
	})
	
	//用来模糊查询的,输入项目名称的文本框
	var pName = new Ext.form.TextField({
		name: 'pName',
		fieldLabel: '项目名称',
		hideLabel: false,
		hidden : false,
		width: 80,
		listeners:{
			specialkey:doQuery
		}
	})
	
	var Columns = [
			{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'industryType',
				type : 'string'
			}, {
				name : 'buildNature',
				type : 'string'
			}, {
				name: 'prjStage',
				type: 'string'
			}, {
				name : 'prjType',
				type : 'string'
			}, {
				name : 'prjName',
				type : 'string'
			}, {
				name : 'prjRespond',
				type : 'string'
			}, {
				name : 'investScale',
				type : 'string'
			}, {
				name : 'buildLimit',        //可以删除的读取参数
				type : 'string'
			},{
				name : 'memoC1',
				type : 'string'
			},{
				name : 'memoC2',            
				type : 'string'
			},{
				name : 'memoC3',
				type : 'string'
			},{
				name : 'memoC4',              
				type : 'string'
			},{
				name : 'isapproved',
				type : 'string'
			},{
				name : 'isapproval',
				type : 'string'
			},{
				name : 'totalinvestment',
				type : 'float'
			},{
				name : 'guiMoDw',
				type : 'string'
			},{
				name: 'approvalTotal',
				type: 'string'
			},{
				name: 'provincelApprovalNum',
				type: 'string'
			},{
				name: 'approvalProcessed',
				type: 'string'
			},{
				name: 'approvalProcessing',
				type: 'string'
			},{
				name: 'approvalWaitProcess',
				type: 'string'
			},{
				name: 'backupC1',
				type: 'string'
			}]
	
	var prjDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : 'com.sgepit.pcmis.approvl.hbm.VPcPwPrjInfo',
			business : 'approvlMgm',
			method : 'getAllPrjPwInfoByUnitid',
			params :"unitid`"+USERBELONGUNITID
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : "uids"
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
		});

	prjDs.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
	var fm = Ext.form;
	
	// 创建列模型
	var prjSm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	var prjCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), 
	    {
			id : 'prjName',
			header : '项目名称',
			dataIndex :'prjName',
			hidden : false,
			width : 270,
			renderer: function(value, meta, record){
				var pid = record.get('pid');
				meta.attr = "title='"+value+"'";
				var prjName = record.get('prjName');
				return "<a href='javascript:jumpController(\"" + pid
							+ "\",\"" + prjName + "\",\"all\")'>"
							+ value + "</a>"
			}
		}, {
			id : 'backupC1',
			header : '项目级别',
			dataIndex : 'backupC1',
			width:100,
			align: 'left',
			renderer: function(v){
				for(i=0; i<prjLevel.length; i++)
				{
					if(v==prjLevel[i][0])
						return prjLevel[i][1];
					else
						continue;
				}
						
						return "";	
			}
		},{
			id : 'industryType',
			header : '产业类型',
			dataIndex : 'industryType',
			align: 'center',
			width : 40,
			hidden: true,
			renderer: function(v){
						for(i=0; i<cyType.length; i++)
						{
							if(v==cyType[i][0])
								return cyType[i][1];
							else
								continue;
						}
						return "";								
					}
		}, {
			id : 'buildNature',
			header : '建设性质',
			dataIndex : 'buildNature',
			hidden : false,
			align: 'center',
			hidden: true,
			width: 40,
			renderer: function(v){
						for(i=0; i<buildType.length; i++)
						{
							if(v==buildType[i][0])
								return buildType[i][1];
							else
								continue;
						}
						
						return "";								
					}
		},{
			id : 'memoC4',
			header : '建设规模',
			dataIndex : 'memoC4',
			hidden : false,
			align: 'center',
			hidden: true,
			width : 60,
			renderer: function(v,m,record){
				
				var t1 = record.get("memoC2")==null?"": record.get("memoC2");
				var t2 = record.get("memoC4")==null?"": record.get("memoC4");
				var t3 = record.get("guiMoDw")==null?"":record.get("guiMoDw");
				
				if(t3!='')
				{
					for(i=0; i<gmDanWei.length; i++)
					{
						if(t3==gmDanWei[i][0])
						{
							t3 = gmDanWei[i][1];
							break;
						}
					}
				}
				
				if(t1!=null&&t1!=""&&t1.length>0){
					t2 = " X "+t2;
				}
				return t1+t2+t3;
			}
		}, {
			id : 'investScale',
			header : '投资规模',
			dataIndex : 'investScale',
			width : 60,
			align: 'right',
			hidden: true,
			renderer: function(val){
				return cnMoneyToPrec(val/10000,2);
			}
		}, {
			id : 'prjType',
			header : '项目类型',
			dataIndex : 'prjType',
			hidden : false,
			align: 'center',
			width: 80,
			renderer: function(v){
						for(i=0; i<prjType.length; i++)
						{
							if(v==prjType[i][0])
								return prjType[i][1];
							else
								continue;
						}
						
						return "";								
					}
		}, {
			id : 'prjRespond',
			header : '项目负责人',
			dataIndex : 'prjRespond',
			hidden : true,
			width: 40
		}, {
			//批文应办理数量
			id : 'uids',
			header : '应办理批文数量',
			dataIndex : 'approvalTotal',
			width:100,
			align: 'left',
			hidden : false,
			renderer: function(value, meta, record){
				var pid = record.get('pid');
				var prjName = record.get('prjName');
				return "<a href='javascript:jumpController(\"" + pid
							+ "\",\"" + prjName + "\",\"all\")'>"
							+ value + "</a>"
			}
		}, {
			id : 'uids',
			header : '省级批文数量',
			dataIndex : 'provincelApprovalNum',
			width:100,
			align: 'left',
			renderer: function(value, meta, record){
				var pid = record.get('pid');
				var prjName = record.get('prjName');
				return value;
//				return "<a href='javascript:jumpController(\"" + pid
//							+ "\",\"" + prjName + "\",\"2\")'>"
//							+ value + "</a>"
			}
		}, {
			//批文已办理数量
			id : 'uids',
			header : '已办理批文数量',
			dataIndex : 'approvalProcessed',
			width:100,
			align: 'left',
			hidden : false,
			renderer: function(value, meta, record){
				var pid = record.get('pid');
				var prjName = record.get('prjName');
				return "<a href='javascript:jumpController(\"" + pid
							+ "\",\"" + prjName + "\",\"2\")'>"
							+ value + "</a>"
			}
		}, {
			//批文办理中数量
			id : 'uids',
			header : '办理中批文数量',
			dataIndex : 'approvalProcessing',
			width:100,
			align: 'left',
			hidden : true,
			renderer: function(value, meta, record){
				var pid = record.get('pid');
				var prjName = record.get('prjName');
				return "<a href='javascript:jumpController(\"" + pid
							+ "\",\"" + prjName + "\",\"1\")'>"
							+ value + "</a>"
			}
		},{
			//批文未办理数量
			id : 'uids',
			header : '未办理批文数量',
			dataIndex : 'approvalWaitProcess',
			width:100,
			align: 'left',
			hidden : true,
			renderer: function(value, meta, record){
				var pid = record.get('pid');
				var prjName = record.get('prjName');
				return "<a href='javascript:jumpController(\"" + pid
							+ "\",\"" + prjName + "\",\"0\")'>"
							+ value + "</a>"
			}
		}]);
	// 列模型创建完毕

	// 创建显示批文办理情况的grid
	var prjGrid = new Ext.grid.GridPanel({
		id: 'prjGrid',
		region : 'center',    //viewport的border布局指定该grid居中显示
		ds : prjDs,
		cm : prjCm, // 列模型
		sm : prjSm,
		tbar : ['单位：&nbsp;&nbsp',unitTree,'&nbsp;&nbsp&nbsp;&nbsp',
				'项目名称：&nbsp;&nbsp',pName,'&nbsp;&nbsp;&nbsp;&nbsp',
				'项目级别(关注程度):&nbsp;&nbsp',prjLevelCombo,'&nbsp;&nbsp;&nbsp;&nbsp',
				'项目类型:&nbsp;&nbsp',prjTypeCombo,'&nbsp;&nbsp&nbsp;&nbsp',
				queryBtn,'&nbsp;&nbsp;&nbsp;&nbsp','-',
				'&nbsp;&nbsp',exportExcelBtn,
				'->','计量单位&nbsp：&nbsp万元'],// 顶部工具栏，可选
		border : false, // 
		bodyBorder: true,
		header : false, //
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			//forceFit : true,
			ignoreAdd : true
		},
//		bbar : new Ext.PagingToolbar({  // 在底部工具栏上添加分页导航
//			pageSize : 10,
//			store : prjDs,
//			displayInfo : true,
//			displayMsg : ' {0} - {1} / {2}',
//			emptyMsg : "无记录。"
//		}),
		iconCls:'icon-grid',
		servletUrl : MAIN_SERVLET,
		primaryKey : "uids"
		});
		
//导出为excel文档方法
	function exportDataFile() {
		var openUrl = CONTEXT_PATH    
				+ "/servlet/ApprovlServlet?ac=exportData&businessType=ApprovlInfo"
				+ "&unitId=" + treeCombo.getValue() 
				+ "&projName=" + pName.getValue()
				+ "&type=" + prjTypeCombo.getValue()
				+ "&level=" + prjLevelCombo.getValue();
		document.all.formAc.action = openUrl;       
		document.all.formAc.submit();
	}
	
//查询方法
function doQuery()
{
	var dwId = treeCombo.getValue();
	var projName = pName.getValue();
	var type = prjTypeCombo.getValue();
	var	level = prjLevelCombo.getValue();
	var filter = '';
	
	filter += (projName==''?"" : "projName" + SPLITB + projName + SPLITA) + 
			  (dwId==''?"" : "unitid" + SPLITB + dwId + SPLITA) + 
			  (type==''?"" : "type" + SPLITB + type + SPLITA) +
			  (level==''?"" : "level" + SPLITB + level)
	
	prjDs.baseParams.params = filter;
//	prjDs.load({params:{start:0,limit:20}});
	prjDs.load();
}		

// 布局实现-----------------------------------------------------------------
	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [prjGrid]
			})
//	prjDs.load({params:{start:0, limit:20}});
	prjDs.load();
})
// Ext.onReady()结束

		
// 其他自定义函数(格式化)
function typeShow(value) {
	for (var i = 0; i < reportType.length; i++) {
		if (value == reportType[i][0]) {
			return reportType[i][1];
			break;
		}
	}
	return "";
}

function statShow(value) {
	for (var i = 0; i < reportStat.length; i++) {
		if (value == reportStat[i][0]) {
			return reportStat[i][1];
			break;
		}
	}
	return "";
}


function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
};


function downloadfile(pid,biztype){
	var param = {
		businessId:pid,
		businessType:biztype,
		editable : "true"
	};
	showMultiFileWin(param);
}

function jumpController(selPid, projectName, appStatus){
	if(selPid==null||selPid==undefined)
		return;
	switchoverProj(selPid, projectName);
	parent.lt.expand();
//	parent.proTreeCombo.show();
//	parent.proTreeCombo.setValue(CURRENTAPPID)
	parent.backToSubSystemBtn.show();
	if(top.pathButton&&top.pathButton.setText&&top.selectedSubSystemName){
	   top.pathButton.setText("<b>当前位置:"+top.selectedSubSystemName+"/批文办理查询</b>")
	}
	if(appStatus==''||appStatus==null)//点击的项目名称
	{
		parent.frames['contentFrame'].location.href = 
		BASE_PATH +'PCBusiness/approvl/pc.approvl.pw.query.main.jsp?pid=' 
																		+ selPid + '&pageLvl=' + pageLvl
																		+ '&projectName='+projectName;
	} else if(appStatus=='all'){  //点击应办理数量
		parent.frames['contentFrame'].location.href = 
		BASE_PATH +'PCBusiness/approvl/pc.approvl.pw.query.main.jsp?pid=' 
											+ selPid + '&appStatus=' + appStatus + '&pageLvl=' + pageLvl
																	+ '&projectName='+projectName;
	} else if(appStatus=='1'||appStatus=='2'||appStatus=='0'){   //点击'已办理','未办理','办理中'的情况
		parent.frames['contentFrame'].location.href = 
		BASE_PATH +'PCBusiness/approvl/pc.approvl.pw.query.main.jsp?pid=' 
											+ selPid + '&appStatus=' + appStatus + '&pageLvl=' + pageLvl
																	+ '&projectName='+projectName;
	} else {
		return; 
	}
}

//创建单位树函数
function _createUniteTree(config,treeid,unitname,unitid){

	var loader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		requestMethod: "GET",
		baseParams : {
			ac : "tree",
			businessName : "approvlMgm",
			treeName: 'pwUnitTree',
			parent: USERBELONGUNITID
		},
		clearOnLoad : true
	});
	
	 treeCombo = new Ext.ux.TreeCombo({
		resizable:true,
		width: 260,
		id:(treeid?treeid:Ext.id()),
		loader:loader,
		value:USERBELONGUNITID,
		root:  new Ext.tree.AsyncTreeNode({
	      text: USERBELONGUNITNAME,
          id: USERBELONGUNITID,
          expanded:true
	    })
	});
	Ext.apply(treeCombo,config);
	 
	treeCombo.getTree().on('beforeload',function(node){
		loader.baseParams.parent = node.id; 
	});
	
	return treeCombo;
}  
