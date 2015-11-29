var bean = "com.sgepit.pcmis.zlgk.hbm.PcZlgkQuaInfo"

Ext.onReady(function() {
	var ypColumns = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'projectId',type : 'string'},
		{name : 'createdate',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'createperson',type : 'string'},
		{name : 'sjType',type : 'string'},
		{name : 'reportname',type : 'string'},
		{name : 'reportStatus',type : 'float'},
		{name : 'memo',type : 'string'}
	];

	var ypDs = new Ext.data.Store({
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
				}, ypColumns),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	ypDs.setDefaultSort('createdate', 'desc'); // 设置默认排序列
	ypDs.load();
	var fm = Ext.form;
	// 创建可编辑配置区域
	var fc = { // 创建编辑域配置
		'uids' : {name : 'uids',fieldLabel : '唯一约束'},
		'pid' : {name : 'pid',fieldLabel : '项目编号'},
		'projectId' : {name : 'projectId',fieldLabel : '验评信息表ID'},
		'createdate' : {name : 'createdate',fieldLabel : '填报时间',	format : 'Y-m-d',minValue : '2010-01-01'},
		'createperson' : {name : 'createperson',fieldLabel : '填报人',allowBlank: false},
		'sjType' : {name : 'sjType',fieldLabel : '报表期别'},
		'reportname' : {name : 'reportname',fieldLabel : '验评信息表名称'},
		'reportStatus' : {name : 'reportStatus',fieldLabel : '上报状态'},
		'memo' : {name : 'memo',fieldLabel : '备注'}
	}
	

	ypSm = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	
	ypCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		}, {
			id : 'projectId',
			header : fc['projectId'].fieldLabel,
			dataIndex : fc['projectId'].name,
			hidden : true
		}, {
			id : 'createdate',
			header : fc['createdate'].fieldLabel,
			dataIndex : fc['createdate'].name,
			align : 'center',
			width : 90,
			renderer : formatDate
		}, {
			id : 'createperson',
			header : fc['createperson'].fieldLabel,
			dataIndex : fc['createperson'].name,
			align : 'center',
			width : 90
		}, {
			id : 'sjType',
			header : fc['sjType'].fieldLabel,
			dataIndex : fc['sjType'].name,
			width:60,
			align:'center',
		    renderer : function(value,cell,record){
		    	return value;
		    }
		}, {
			id : 'reportname',
			header : fc['reportname'].fieldLabel,
			dataIndex : fc['reportname'].name,
			align : 'center',
			width : 200,
			renderer : function(value,cell,record){
				return record.get('uids')==""?value:"<a href='javascript:zlgkHzTjWin(\""+record.get('uids')+"\",\""+record.get('sjType')+"\")'>"+value+"</a>"
			}
		}, {
			// 这里附件id使用uids
			id : 'uids',
			header : '附件',
			dataIndex : 'uids',
			width : 50,
			align:'center',
			renderer : function(value,cell,record){
				return "<a href='javascript:uploadfile(\""+value+"\",\"PczlypReport\")'>查看</a>"
			}
		},{
			id : 'memo',
			header : fc['memo'].fieldLabel,
			dataIndex : fc['memo'].name,
			width : 220
		}]);

	var ypGrid = new Ext.grid.GridPanel({
		ds : ypDs,
		cm : ypCm, // 列模型
		sm : ypSm,
		layout : 'fit',
		region : 'center',
		tbar :['->',new Ext.Button({
			text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		})],
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
	
	var panelDwgc = new Ext.Panel({
		id:'dwgc',
		title:'单位工程',
		region: 'center',
		layout: 'fit',
		border:false,
		collapsed: false,
        collapsible: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		html: '<iframe name="dwgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelFxgc = new Ext.Panel({
		id:'fxgc',
		title:'分项工程',
		region: 'center',
		layout: 'fit',
		border:false,
		collapsed: false,
        collapsible: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		html: '<iframe name="fxgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelFbgc = new Ext.Panel({
		id:'fbgc',
		title:'分部工程',
		border : false,
		region : 'center',
		layout: 'fit',
		html: '<iframe name="fbgcFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	var panelJyp = new Ext.Panel({
		id:'jyp',
		title:'检验批',
		border : false,
		region : 'center',
		layout: 'fit',
		html: '<iframe name="jypFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	tabs = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: false,
        split: true,
        plain: true,
        border: true,
        region: 'center',
        forceFit: true,
        items:[panelDwgc,panelFxgc,panelFbgc,panelJyp]
    });
    
    
	tabs.on('tabchange',function(value){
		var panelId = value.getActiveTab().id;
		var xgridUrl = CONTEXT_PATH+"/PCBusiness/zlgk/templateXgridView.jsp";
		var sj_type = '2011'; // 时间
		var unit_id = UNITID; // 取表头用
		var editable = true; // 是否能编辑，不传为不能编辑
		var headtype = 'PC_ZLGK_ZLPY';
		var keycol = 'uids';
		var ordercol = 'uids'
		var hasInsertBtn = false;
		var hasSaveBtn = false; //更具上报状态隐藏xGrid中的保存按钮
		var hasDelBtn = false;
		var skin = 'light';		//设置皮肤外观
		var hasFooter = false;	//隐藏底部统计
		var hideAllBtn = true;  //隐藏所有按钮
		var filter = " and pid='"+CURRENTAPPID+"' and sj_Type='"+hzSjType+"' and master_id='"+hzTabsUids+"'"
		xgridUrl = xgridUrl+"?unit_id="+unit_id+"&editable="+editable+"&headtype="+headtype+"&keycol="+keycol+"&ordercol="+ordercol+"&hasInsertBtn="+hasInsertBtn+"&hasDelBtn="+hasDelBtn+"&hasFooter="+hasFooter+"&skin="+skin+"&hideAllBtn="+hideAllBtn
		hzJyxmlx = 1;
		if(panelId=='dwgc'){
			hzJyxmlx = 1;
			filter = filter +' and jyxmlx=1';
			sj_type = '201101';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
			window.frames["dwgcFrame"].location.href = xgridUrl;
		}
    	if(panelId=='fxgc'){
    		hzJyxmlx = 2;
    		filter = filter +' and jyxmlx=2'
    		sj_type = '201102';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["fxgcFrame"].location.href = xgridUrl;
    	}
    	if(panelId=='fbgc'){
    		hzJyxmlx = 3;
    		filter = filter +' and jyxmlx=3'
    		sj_type = '201103';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["fbgcFrame"].location.href = xgridUrl;
    	}
    	if(panelId=='jyp'){
    		hzJyxmlx = 4;
    		filter = filter +' and jyxmlx=4'
    		sj_type = '201104';
			xgridUrl = xgridUrl+"&sj_type="+sj_type+"&filter="+filter
    		window.frames["jypFrame"].location.href = xgridUrl;
    	}
    })
    
	hzWin = new Ext.Window({
		title: '质量管控子系统汇总统计表',
		width: 700,
		height: 500,
		modal: true,
		plain: true, 
//		border: false, 
		resizable: true,
		closeAction: 'hide',
		layout: 'fit',
		items:[tabs]
	})
	hzWin.on('hide',function(){
		window.location.reload();
	})
	
	var viewPort = new Ext.Viewport({
		layout : 'border',
		items : [ypGrid]
	})
	
	// 其他自定义函数(日期格式化)
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};	
});

	//附件上传
	function uploadfile(pid,biztype){
		
		var param = {
			businessId:pid,
			businessType:biztype,
			editable : false
		};
		showMultiFileWin(param);
	}
	
	function zlgkHzTjWin(uids,sj){
		hzTabsUids = uids;
		hzSjType = sj;
		hzWin.show();
	}
