
var approvalStatus = [['%', '全部'], ['2', '已办理'], ['0', '未办理'], ['1', '办理中']];
var dsPwStatus = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : approvalStatus
			});

var pwStatusCombo = new Ext.form.ComboBox({
				name : 'approval-status',
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				triggerAction : 'all',
				store : dsPwStatus,
				lazyRender : true,
				allowBlank : true,
				listClass : 'x-combo-list-small',
				value : '%',
				width : 70,
				id:'statusCombo',
				listeners : {
					select : function(combo) {
						doSearch();
					}
				}
			});
			
	//批文建立column
	var pwColumns = [{
				name : 'uids',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'sortUids',
				type : 'string'
			}, {
				name : 'pwNo',
				type : 'string'
			}, {
				name : 'pwName',
				type : 'string'
			}, {
				name : 'pwFileId',
				type : 'string'
			}, {
				name : 'pwFileName',
				type : 'string'
			}, {
				name : 'fileId',
				type : 'string'
			}, {
				name : 'mgmStatus',
				type : 'string'
			}, {
			    name : 'rateStatus',
				type : 'float'
			}, {
				name : 'dealStatus',
				type : 'string'
			}, {
				name : 'mgmUser',
				type : 'string'
			}, {
				name : 'mgmUser',
				type : 'string'
			}, {
				name : 'nodepath',
				type : 'string'
			}, {
				name : 'inputDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'planStartDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'planEndDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'realStartDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'realEndDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'pwFileOverview',
				type : 'string'
			}]
	
	//批文办理可编辑配置域
	var fm = Ext.form;
	// 创建可编辑配置区域
	var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '唯一约束',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'sortUids' : {
			name : 'sortUids',
			fieldLabel : '批文分类',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'pwNo' : {
			name : 'pwNo',
			fieldLabel : '批文编号',
			hidden : false,
			hideLabel : false,
			anchor : '95%'
		},
		'pwName' : {
			name : 'pwName',
			fieldLabel : '批文名称',
			hidden : false,
			hideLabel : false,
			allowBlank: false,
			anchor : '95%'
		},
		'pwFileId' : {
			name : 'pwFileId',
			fieldLabel : '批文文件id',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'pwFileName' : {
			name : 'pwFileName',
			fieldLabel : '批文文件',
			hidden : false,
			hideLabel : false,
			anchor : '95%'
		},
		'fileId' : {
			name : 'fileId',
			fieldLabel : '批文标准文件ID',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'mgmStatus' : {
			name : 'mgmStatus',
			fieldLabel : '备注',
			hidden : false,
			hideLabel : false,
			anchor : '95%'
		},
		'rateStatus' : {
			name : 'rateStatus',
			fieldLabel : '进度状态',
			hidden : false,
			hideLabel : false,
			anchor : '95%'
		},
		'dealStatus' : {
			name : 'dealStatus',
			fieldLabel : '办理状态',
			displayField : 'v',
			valueField : 'k',
			xtype:'combo',
			editable:false,
			store : new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : [['0', '未办理'], ['1', '办理中'], ['2', '已办理']]
					}),
			mode : 'local',
			triggerAction : 'all',
			lazyRender : false,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'mgmUser' : {
			name : 'mgmUser',
			fieldLabel : '负责人',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'planStartDate' : {
			name : 'planStartDate',
			fieldLabel : '计划开始时间',
			format : 'Y-m-d',
			minValue : '2010-01-01',
			anchor : '95%'
		},
		'planEndDate' : {
			name : 'planEndDate',
			fieldLabel : '计划完成时间',
			format : 'Y-m-d',
			minValue : '2010-01-01',
			anchor : '95%'
		},
		'realStartDate' : {
			name : 'realStartDate',
			fieldLabel : '实际开始时间',
			format : 'Y-m-d',
			minValue : '2010-01-01',
			anchor : '95%'
		},
		'realEndDate' : {
			name : 'realEndDate',
			fieldLabel : '实际结束时间',
			format : 'Y-m-d',
			minValue : '2010-01-01',
			anchor : '95%'
		},
		'pwFileOverview' : {
			name : 'pwFileOverview',
			fieldLabel : '文件概述',
			hidden : false,
			hideLabel : false,
			anchor : '95%'
		}
	};
	
	//批文办理选择模型
	var slModel = new Ext.grid.CheckboxSelectionModel({
		header:'',
		singleSelect : true
	});
	
	//批文办理数据源
	var pwDS = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : 'com.sgepit.pcmis.approvl.hbm.PcPwApprovalMgm',
			business : 'baseMgm',
			method : 'findWhereOrderby',
			params : "pid='" + pid + "'"
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
      		 
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : "uids"
				}, pwColumns),
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	pwDS.setDefaultSort('inputDate','desc');
	
	//批文建议列模型
	var pwjyColumns = [{
			name : 'uids',
			type : 'string'
		},{
			name : 'pid',
			type : 'string'
		}, {
			name : 'mgmUids',
			type : 'string'
		}, {
			name : 'username',
			type : 'string'
		}, {
			name : 'adviseContent',
			type : 'string'
		}, {
			name : 'adviseDate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'userid',
			type : 'string'
		}, {
			name : 'userdep',
			type : 'string'
		}]
		
	//批文建议编辑配置
		var adviseFc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '唯一约束',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '项目编号',
			hidden : true,
			hideLabel : true
		},
		'mgmUids' : {
			name : 'mgmUids',
			fieldLabel : '外键与批文执行关联',
			hideLabel : true
		},
		'username' : {
			name : 'username',
			fieldLabel : '建议人'
		},
		'adviseContent' : {
			name : 'adviseContent',
			fieldLabel : '建议内容',
			hidden : false,
			hideLabel : false
		},
		'adviseDate' : {
			name : 'adviseDate',
			fieldLabel : '建议日期',
			hideLabel : false,
			format : 'Y-m-d',
			minValue : '2010-01-01',
			anchor : '95%'
		},
		'userid' : {
			name : 'userid',
			fieldLabel : '保留字段',
			hidden : true,
			hideLabel : true
		},
		'userdep' : {
			name : 'userdep',
			fieldLabel : '建议单位',
			hidden : false,
			hideLabel : false
		}
	}
	
	//批文建议数据源
	var pwjyDS = new Ext.data.Store({
	baseParams : {
		ac : 'list', // 表示取列表
		bean : "com.sgepit.pcmis.approvl.hbm.PcPwApprovalAdvise",
		business : "baseMgm",
		method : "findWhereOrderby",
		params : null
	},
	proxy : new Ext.data.HttpProxy({
				method : 'GET',
				url : MAIN_SERVLET
			}),
	reader : new Ext.data.JsonReader({
				root : 'topics',
				totalProperty : 'totalCount',
				id : "uids"
			}, pwjyColumns),
	remoteSort : true,
	pruneModifiedRecords : true
	});
	pwjyDS.setDefaultSort('adviseDate','desc');

//批文分类树
function getPwSortTree(config) {
	var _pwSortTree = new Ext.tree.ColumnTree(Ext.apply({
				region : 'west',
				width : 160,
				title : '&nbsp;',
				collapsible:true,
				collapseMode:'mini',
				autoScroll: true,
				rootVisible : true,
				columns : [{
							header : '批文分类名称',
							width : 200,
							dataIndex : 'classifyName'
						}],
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							baseParams : {
								ac : "columntree",
								treeName : "inputTreeSub",
								businessName : "approvlMgm",
								parent : "0",
								pid : pid
							},
							clearOnLoad : true,
							baseAttrs : {
								expanded : true
							},
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : '0',
							text : '批文分类树',
							classfiyNo : '0',
							expanded : true
						}),
				tbar : [{
					iconCls : 'icon-expand-all',
					tooltip : '全部展开',
					handler : function() {
						if (_pwSortTree && _pwSortTree.root
								&& _pwSortTree.root.expand)
							_pwSortTree.root.expand(true);
					}
				}, '-', {
					iconCls : 'icon-collapse-all',
					tooltip : '全部折叠',
					handler : function() {
						if (_pwSortTree && _pwSortTree.root
								&& _pwSortTree.root.collapse)
							_pwSortTree.root.collapse(true);
					}
				}]
			}, config || {}));

	return _pwSortTree
}

//批文名称, 批文办理状态, 项目选择下拉框的过滤方法
function doSearch(){
	var pagePid = pid;
	var pwName = Ext.getCmp('pwField').getValue()==''? '%':Ext.getCmp('pwField').getValue();
	var status = Ext.getCmp('statusCombo').getValue()==''? '%':Ext.getCmp('statusCombo').getValue();
	var sortTree = Ext.getCmp('sortTree');
	var node = sortTree.getSelectionModel().getSelectedNode();
	var pid = Ext.getCmp('prjTree').getValue();
	if(node==null)
	{
		pwGrid.getStore().baseParams.params = "dealStatus like'" + status + 
										"'and pid='" + pid + "' and pw_name like '%"+
										pwName+"%'";
	}
	else
	{
		pwGrid.getStore().baseParams.params = "dealStatus like'" + status + 
										"'and pid='" + pid + "' and pw_name like '%"+
										pwName + "%' and Instr(nodepath||'/','"+ 
										node.getPath('classfiyNo') + "/')>0"
										
	}
										
	pwGrid.getStore().load({params:{start:0,limit:20}});
}

//判断字符串占用多少字节数的方法
function bytesOfString(str)
{
	var bytesCount = 0;
	if(null==str||str.length==0)
	{
		return 0;
	}
	
	for(var i=0; i<str.length; i++)
	{
		var c = str.charAt(i);
		if (/^[\u0000-\u00ff]$/.test(c))   //
		{
			//非双字节的编码字节数只+1
			bytesCount += 1;
		}
		else
		{   
			//双字节的编码(比如汉字)字节数+2
			bytesCount += 2;
		}
	}
	
	return bytesCount;
}

// 其他自定义函数(格式化)
function statusShow(value) {
	for (var i = 0; i < approvalStatus.length; i++) {
		if (value == approvalStatus[i][0]) {
			if(value=='0'){
				return "<font color=gray>"+approvalStatus[i][1]+"</font>";
			}else if(value=="1"){
				return "<font color=green>"+approvalStatus[i][1]+"</font>";
			}else if(value=="2"){
				return "<font color=blue>"+approvalStatus[i][1]+"</font>";
			}
			return approvalStatus[i][1];
		}
	}
	return "";
}

//显示文件概述
function showOverview(v)
{
		var win = new OverviewWindow({value:v});
		win.show();
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
		width: 240,
		id:'prjTree',
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
	
