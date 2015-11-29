var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetymonthInfo"
var businessType="PCAqgkSafetymonthAffix"
var grid=null;
var curr_date=new Date();
Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect : true})
	var fm = Ext.form;
	var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '项目编码',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'title':{
			name : 'title',
			fieldLabel : '月报标题',
			anchor : '95%'
		},
		'infoTime' : {
			name : 'infoTime',
			fieldLabel : '上报时间',
			hidden : !isQuery,
			hideLabel : !isQuery,
			anchor : '95%'
		},
		'reporttime' : {
			name : 'reporttime',
			fieldLabel : '月报月份',
			anchor : '95%'
		},
		'reportperson' : {
			name : 'reportperson',
			fieldLabel : '上报人',
			anchor : '95%'
		},
		'status' : {
			name : 'status',
			fieldLabel : '状态',
			anchor : '95%'
		}
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
		new Ext.grid.RowNumberer(), {
				id : 'uids',
				type : 'string',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				type : 'string',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'title',
				type : 'string',
				header : fc['title'].fieldLabel,
				dataIndex : fc['title'].name,
				width:160,
				editor: new fm.TextField(fc['title'])
			}, {
				id : 'reporttime',
				type : 'date',
				align : 'center',
				width:50,
				header : fc['reporttime'].fieldLabel,
				dataIndex : fc['reporttime'].name,
				editor: new Ext.form.DateField(fc['reporttime']),
				renderer:function(v){if(v)return v.format('Y-m')}
			
			}, {
				id : 'infoTime',
				type : 'date',
				width:80,
				header : fc['infoTime'].fieldLabel,
				dataIndex : fc['infoTime'].name,
				hidden:!isQuery,
				renderer:function(v){if(v)return v.format('Y-m-d H:i:s')}
			
			}, {
				id : 'reportperson',
				type : 'string',
				align : 'center',
				width:50,
				header : fc['reportperson'].fieldLabel,
				dataIndex : fc['reportperson'].name,
				editor: new fm.TextField(fc['reportperson'])
			}, {
				id : 'upload',
				type : 'string',
				header : "附件",
				width:50,
				align:'center',
				dataIndex :"uids",
				renderer:function(v){
					return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>查看</a>";
				}
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序
	// 3. 定义记录集
	var Columns = [{
			name : 'uids',
			type : 'string'
		},{
			name : 'pid',
			type : 'string'
		}, {
			name : 'title',
			type : 'string'
		}, {
			name : 'infoTime',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'reporttime',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'reportperson',
			type : 'string'
		}, {
			name : 'status',
			type : 'float'
	}];
	var ds= new Ext.data.Store({
		baseParams : {
			beanName : bean,
			primaryKey: 'uids',
			pid : PID,
			uids : UIDS
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : CONTEXT_PATH + "/servlet/DynamicServlet"
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'uids'
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.load();
	grid = new Ext.grid.GridPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar :['->',new Ext.Button({
			text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		})],
		border : false,
		layout : 'fit',
		region : 'center',
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [grid]
	});
	
});  

function uploadfile(uids,biztype){
	var param = {
		businessId:uids,
		businessType:biztype,
		editable : false
	};
	showMultiFileWin(param);
}


