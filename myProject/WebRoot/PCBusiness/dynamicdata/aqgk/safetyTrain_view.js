var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetytrainInfo"
var businessType="PCAqgkSafetyTrainAffix"
var grid=null;
Ext.onReady(function() {
	//1. 创建选择模式
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect : true})
	//2. 创建列模型
	var fm = Ext.form;
	// 创建编辑域配置
	var fc = { 
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
		'traintime' : {
			name : 'traintime',
			fieldLabel : '培训时间',
			anchor : '95%'
		},
		'trainaddr' : {
			name : 'trainaddr',
			fieldLabel : '培训地点',
			anchor : '95%'
		},
		'traintitle' : {
			name : 'traintitle',
			fieldLabel : '培训主题',
			anchor : '95%'
		},
		'trainnumber' : {
			name : 'trainnumber',
			fieldLabel : '培训人数',
			anchor : '95%'
		},
		'trainStatus' : {
			name : 'trainStatus',
			fieldLabel : '状态',
			anchor : '95%'
		}
		
	}
	// 创建列模型
	var cm = new Ext.grid.ColumnModel([ 
			new Ext.grid.RowNumberer(), 
			{
				id : 'traintime',
				type : 'string',
				align : 'center',
				width:60,
				header : fc['traintime'].fieldLabel,
				dataIndex : fc['traintime'].name
			}, {
				id : 'trainaddr',
				type : 'string',
				width:160,
				header : fc['trainaddr'].fieldLabel,
				dataIndex : fc['trainaddr'].name
			
			}, {
				id : 'traintitle',
				type : 'string',
				width:160,
				header : fc['traintitle'].fieldLabel,
				dataIndex : fc['traintitle'].name,
				renderer:function(v,m,record){
					var uids=record.get('uids');
					var pid=record.get('pid');
					return "<a href='javascript:jumpTo(\""+uids+"\",\""+pid+"\")' title='"+v+"'>"+v+"</a>"
				}
			}, {
				id : 'trainnumber',
				type : 'string',
				align : 'right',
				width:50,
				header : fc['trainnumber'].fieldLabel,
				dataIndex : fc['trainnumber'].name
			}, {
				id : 'upload',
				type : 'string',
				header : "附件",
				dataIndex :"uids",
				align : 'center',
				width:50,
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
			},
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'traintime',
				type : 'string'
			}, {
				name : 'trainaddr',
				type : 'string'
			}, {
				name : 'trainunit',
				type : 'string'
			}, {
				name : 'traintitle',
				type : 'string'
			}, {
				name : 'trainnumber',
				type : 'string'
			}, {
				name : 'traincontent',
				type : 'string'
			}, {
				name : 'remarks',
				type : 'string'
			},{
				name : 'trainStatus',
				type : 'float'
			}];
 	//创建数据源
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

function jumpTo(uids,pid){
	baseWindow = new Ext.Window({
        width: 710,
        height:510,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain: true,
        closeAction: 'hide',
        modal: true,
        html: "<iframe name='accidentFrame' src='" + CONTEXT_PATH + 
        "/PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetyTrain.addOrUpdate.jsp?edit=false&edit_uids="+uids+"&edit_pid="+pid+"&hiddRest=true"+
        "' frameborder=0 width=100% height=100%></iframe>"
    });
    baseWindow.show();
};
