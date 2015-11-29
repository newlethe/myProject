var beanB = "com.sgepit.pmis.wzgl.hbm.WzInput"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";

Ext.onReady(function(){
	var smB = new Ext.grid.CheckboxSelectionModel({singleSelect:true})	
	var fm = Ext.form;			
	var fcB = { 
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',  
			hideLabel : true
		},'bh' : {
			name : 'bh',
			fieldLabel : '入库单编号',  
			hideLabel : true
		},'hth' : {
			name : 'uids',
			fieldLabel : '采购合同',  
			hideLabel : true
		},'cgbh' : {
			name : 'cgbh',
			fieldLabel : '采购计划',  
			hideLabel : true
		},'ckh' : {
			name : 'ckh',
			fieldLabel : '仓库',
			anchor : '95%'
		},'bm' : {
			name : 'bm',
			fieldLabel : '编码',  
			hideLabel : true
		},'pm' : {
			name : 'pm',
			fieldLabel : '品名',
			anchor : '95%'
		},'gg' : {
			name : 'gg',
			fieldLabel : '规格型号',
			anchor : '95%'
		},'dw' : {
			name : 'dw',
			fieldLabel : '单位',
			anchor : '95%'
		},'jhdj' : {
			name : 'jhdj',
			fieldLabel : '计划单价',
			anchor : '95%'
		},'sjdj' : {
			name : 'sjdj',
			fieldLabel : '实际单价',
			anchor : '95%'
		},'sv' : {
			name : 'sv',
			fieldLabel : '税率',
			anchor : '95%'
		},'sqsl' : {
			name : 'sqsl',
			fieldLabel : '到货数量',
			anchor : '95%'
		},'zjbh' : {
			name : 'zjbh',
			fieldLabel : '发票号',
			anchor : '95%'
		},'jhbh' : {
			name : 'jhbh',
			fieldLabel : '申请计划编号',
			anchor : '95%'
		},'phbh' : {
			name : 'phbh',
			fieldLabel : '到货记录编号',
			anchor : '95%'
		},'bz' : {  
			name : 'bz',
			fieldLabel : '备注',
			anchor : '95%'
		},'billType' : {  
			name : 'billType',
			fieldLabel : '记录类型',
			anchor : '95%'
		},'billName' : {  
			name : 'billName',
			fieldLabel : '单据名称',
			anchor : '95%'
		},'billState' : {  
			name : 'billState',
			fieldLabel : '操作',
			anchor : '95%'
		}
		/* GHDW, BGR, JHR,BILL_TYPE,BILL_STATE,
		SL,SJDJ,JHDJ,JHZJ,SJZJ,BILL_TYPE,ZDRQ,QRRQ,
		*/	
	}
	
	  var ColumnsB = [
	  	{name: 'uids', type: 'string'},
	  	{name: 'bh', type: 'string'},
	  	{name: 'hth', type: 'string'},
	  	{name: 'cgbh', type: 'string'},
	  	{name: 'ckh', type: 'string'},
	  	{name: 'bm', type: 'string'},    		
		{name: 'pm', type: 'string'},
		{name: 'gg', type: 'string' },
		{name: 'dw', type: 'string'},
		{name: 'jhdj', type: 'float'},
		{name: 'sjdj', type: 'float'},	
		{name: 'sv', type: 'float'},
		{name: 'sqsl', type: 'float'},
		{name: 'zjbh', type: 'string'},
		{name: 'jhbh', type: 'string'},
		{name: 'phbh', type: 'string'},
		{name: 'billType', type: 'string'},
		{name: 'billName', type: 'string'},
		{name: 'billState', type: 'string'},
		{name: 'bz', type: 'string'}
		
	];
	
	//---------------------------【待入库】---------------------
	var dsB = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanB,
			business : businessB,
			method : listMethodB,
			params : null
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyB
		}, ColumnsB),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsB.setDefaultSort(orderColumnB, 'asc');	
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uids',
		header : fcB['uids'].fieldLabel,
		dataIndex : fcB['uids'].name,
		hidden : true
	}, {
		id : 'bh',
		header : fcB['bh'].fieldLabel,
		dataIndex : fcB['bh'].name,
		hidden : true
	},{
		id : 'hth',
		header : fcB['hth'].fieldLabel,
		dataIndex : fcB['hth'].name,
		hidden : true
	},{
		id : 'cgbh',
		header : fcB['cgbh'].fieldLabel,
		dataIndex : fcB['cgbh'].name,
		hidden : true
	},{
		id : 'zjbh',
		header : fcB['zjbh'].fieldLabel,
		dataIndex : fcB['zjbh'].name,
		hidden : true
	},{
		id : 'phbh',
		header : fcB['phbh'].fieldLabel,
		dataIndex : fcB['phbh'].name,
		hidden : true
	},{
		id : 'bm',
		header : fcB['bm'].fieldLabel,
		dataIndex : fcB['bm'].name,
		hidden : true
	}, {
		id : 'ckh',
		header : fcB['ckh'].fieldLabel,
		dataIndex : fcB['ckh'].name,
		hidden : true
	}, {
		id : 'bm',
		header : fcB['bm'].fieldLabel,
		align:"center",
		dataIndex : fcB['bm'].name
	}, {
		id : 'pm',
		header : fcB['pm'].fieldLabel,
		dataIndex : fcB['pm'].name,
		align:"center",
		width :200
		
	}, {
		id : 'gg',
		header : fcB['gg'].fieldLabel,
		dataIndex : fcB['gg'].name,
		align:"center",
		width :200
	}, {
		id : 'dw',
		header : fcB['dw'].fieldLabel,
		dataIndex : fcB['dw'].name,
		align:"center",
		width :40
	}, {
		id : 'jhdj',
		header : fcB['jhdj'].fieldLabel,
		dataIndex : fcB['jhdj'].name,
		align:"center",
		width :80
	}, {
		id : 'sjdj',
		header : fcB['sjdj'].fieldLabel,
		dataIndex : fcB['sjdj'].name,
		align:"center",
		width :80
	}, {
		id : 'sv',
		header : fcB['sv'].fieldLabel,
		dataIndex : fcB['sv'].name,
		align:"center",
		width :40
	}, {
		id : 'sqsl',
		header : fcB['sqsl'].fieldLabel,
		dataIndex : fcB['sqsl'].name,
		align:"center"
	}, {
		id : 'billType',
		header : fcB['billType'].fieldLabel,
		dataIndex : fcB['billType'].name,
		hidden: true,
		align:"center"
	}, {
		id : 'billName',
		header : fcB['billName'].fieldLabel,
		dataIndex : fcB['billName'].name,
		hidden: true,
		align:"center"
	},
	/* {
		id : 'billState',
		header : fcB['billState'].fieldLabel,
		dataIndex : fcB['billState'].name,	
		align:"center",
		renderer : function(val,metadata,rec ){		
			var cgbh = rec.get("cgbh")
			var bm = rec.get("bm")
			var uids = rec.get("uids")
			var billState = rec.get("billState")
			var billType= rec.get("billType")
			if(rec.get("billType")=='到货') {
				return  "<button onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"') style='height:18' class='pageBtn'>入库</button>"
			}
			else {
				if(val=='Y' || val=='S') {
					return "<U style='cursor:hand' onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"')><font color=green>已验收</font></U>"
				}
				else if(val=='F') {
					return "<U style='cursor:hand' onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"')>已作废</U>"
				}
				else {
					return  "<U style='cursor:hand' onclick=stockIn('" +cgbh+ "','" + bm+"','" + uids +"','" +billState + "','" + billType+"') ><font color=red>待验收</font></U>"
				}
			}	
		}
	},*/
	{
		id : 'bz',
		header : fcB['bz'].fieldLabel,
		dataIndex : fcB['bz'].name
	}
	])
	cmB.defaultSortable = true;
	
	var ysBtn = new Ext.Button({
		text:'申请验收',
		iconCls:'btn',
		handler:saveys
	})
	var gridPanel_output = new Ext.grid.EditorGridTbarPanel({
		title:'待入库',
		id : 'matPanel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [ysBtn],
		border : false,
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
		saveBtn: false,
		addBtn: false,
		delBtn: false,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		business : businessB,		
		primaryKey : primaryKeyB
	});   
	
	if(isFlwTask==true ){
		dsB.baseParams.params = " bh='"+isFlwUids+"' and bill_type='计划入库' and bill_state ='N'";
	}else{
		dsB.baseParams.params = " bill_type='计划入库' and bill_state ='N'";
	}
	dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
	
	function saveys(){
	  var selectRows = gridPanel_output.getSelectionModel().getSelections();
	  var uidsStr = "";
	  for(var i=0;i<selectRows.length;i++){
	         uidsStr+=selectRows[i].get('uids')+",";
	   }
	   if(uidsStr!=""){
		  DWREngine.setAsync(false);
		  stockMgm.modifyWzInputCheckin(uidsStr,function(dat){
		  	if(dat){
		  		Ext.example.msg('提示！', '申请成功！');
		  		dsB.reload();
		  		dsB_spz.reload();
		  		dsB_ysp.reload();
		  		if(isFlwTask==true){
		  			Ext.Msg.show({
					   title: '保存成功！',
					   msg: '成功申请验收一条领料单！　　　<br>可以发送流程到下一步操作！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO,
					   fn: function(value){
					   		if ('ok' == value){
					   			parent.IS_FINISHED_TASK = true;
								parent.mainTabPanel.setActiveTab('common');
					   		}
					   }
					});
		  		}
		  	}else{
		  		Ext.example.msg('提示！', '申请失败！');
		  	}
		  })
		  DWREngine.setAsync(true);
	   }
	}
//---------------------------【审批中】---------------------
	var cmB_spz = new Ext.grid.ColumnModel([
		{id : 'uids',header : fcB['uids'].fieldLabel,dataIndex : fcB['uids'].name,hidden : true}, 
		{id : 'bh',header : fcB['bh'].fieldLabel,dataIndex : fcB['bh'].name,hidden : true},
		{id : 'hth',header : fcB['hth'].fieldLabel,dataIndex : fcB['hth'].name,hidden : true},
		{id : 'cgbh',header : fcB['cgbh'].fieldLabel,dataIndex : fcB['cgbh'].name,hidden : true},
		{id : 'zjbh',header : fcB['zjbh'].fieldLabel,dataIndex : fcB['zjbh'].name,hidden : true},
		{id : 'phbh',header : fcB['phbh'].fieldLabel,dataIndex : fcB['phbh'].name,hidden : true},
		{id : 'bm',header : fcB['bm'].fieldLabel,dataIndex : fcB['bm'].name,hidden : true}, 
		{id : 'ckh',header : fcB['ckh'].fieldLabel,dataIndex : fcB['ckh'].name,hidden : true},
	    {id : 'bm',header : fcB['bm'].fieldLabel,align:"center",dataIndex : fcB['bm'].name}, 
		{id : 'pm',header : fcB['pm'].fieldLabel,dataIndex : fcB['pm'].name,align:"center",width :200}, 
		{id : 'gg',header : fcB['gg'].fieldLabel,dataIndex : fcB['gg'].name,align:"center",width :200},
		{id : 'dw',header : fcB['dw'].fieldLabel,dataIndex : fcB['dw'].name,align:"center",width :40}, 
		{id : 'jhdj',header : fcB['jhdj'].fieldLabel,dataIndex : fcB['jhdj'].name,align:"center",width :80}, 
		{id : 'sjdj',header : fcB['sjdj'].fieldLabel,dataIndex : fcB['sjdj'].name,align:"center",width :80}, 
		{id : 'sv',header : fcB['sv'].fieldLabel,dataIndex : fcB['sv'].name,align:"center",width :40}, 
		{id : 'sqsl',header : fcB['sqsl'].fieldLabel,dataIndex : fcB['sqsl'].name,align:"center"}, 
		{id : 'billType',header : fcB['billType'].fieldLabel,dataIndex : fcB['billType'].name,hidden: true,align:"center"}, 
		{id : 'billName',header : fcB['billName'].fieldLabel,dataIndex : fcB['billName'].name,hidden: true,align:"center"},
		{id : 'bz',header : fcB['bz'].fieldLabel,dataIndex : fcB['bz'].name}
	])
	cmB_spz.defaultSortable = true;
	var dsB_spz = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanB,
			business : businessB,
			method : listMethodB,
			params : null
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyB
		}, ColumnsB),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsB_spz.setDefaultSort(orderColumnB, 'asc');
	var gridPanel_spz = new Ext.grid.EditorGridTbarPanel({
		title:'审批中',
		ds : dsB_spz,
		cm : cmB_spz,
		tbar : [ ],
		border : false,
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
		saveBtn: false,
		addBtn: false,
		delBtn: false,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB_spz,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		business : businessB,		
		primaryKey : primaryKeyB
	});   
	
	dsB_spz.baseParams.params = " bill_type='计划入库' and bill_state ='Y'";
	dsB_spz.load({ params:{start: 0, limit: PAGE_SIZE }});
	
//---------------------------【已入库】---------------------
	var cmB_ysp = new Ext.grid.ColumnModel([
		{id : 'uids',header : fcB['uids'].fieldLabel,dataIndex : fcB['uids'].name,hidden : true}, 
		{id : 'bh',header : fcB['bh'].fieldLabel,dataIndex : fcB['bh'].name,hidden : true},
		{id : 'hth',header : fcB['hth'].fieldLabel,dataIndex : fcB['hth'].name,hidden : true},
		{id : 'cgbh',header : fcB['cgbh'].fieldLabel,dataIndex : fcB['cgbh'].name,hidden : true},
		{id : 'zjbh',header : fcB['zjbh'].fieldLabel,dataIndex : fcB['zjbh'].name,hidden : true},
		{id : 'phbh',header : fcB['phbh'].fieldLabel,dataIndex : fcB['phbh'].name,hidden : true},
		{id : 'bm',header : fcB['bm'].fieldLabel,dataIndex : fcB['bm'].name,hidden : true}, 
		{id : 'ckh',header : fcB['ckh'].fieldLabel,dataIndex : fcB['ckh'].name,hidden : true},
	    {id : 'bm',header : fcB['bm'].fieldLabel,align:"center",dataIndex : fcB['bm'].name}, 
		{id : 'pm',header : fcB['pm'].fieldLabel,dataIndex : fcB['pm'].name,align:"center",width :200}, 
		{id : 'gg',header : fcB['gg'].fieldLabel,dataIndex : fcB['gg'].name,align:"center",width :200},
		{id : 'dw',header : fcB['dw'].fieldLabel,dataIndex : fcB['dw'].name,align:"center",width :40}, 
		{id : 'jhdj',header : fcB['jhdj'].fieldLabel,dataIndex : fcB['jhdj'].name,align:"center",width :80}, 
		{id : 'sjdj',header : fcB['sjdj'].fieldLabel,dataIndex : fcB['sjdj'].name,align:"center",width :80}, 
		{id : 'sv',header : fcB['sv'].fieldLabel,dataIndex : fcB['sv'].name,align:"center",width :40}, 
		{id : 'sqsl',header : fcB['sqsl'].fieldLabel,dataIndex : fcB['sqsl'].name,align:"center"}, 
		{id : 'billType',header : fcB['billType'].fieldLabel,dataIndex : fcB['billType'].name,hidden: true,align:"center"}, 
		{id : 'billName',header : fcB['billName'].fieldLabel,dataIndex : fcB['billName'].name,hidden: true,align:"center"},
		{id : 'bz',header : fcB['bz'].fieldLabel,dataIndex : fcB['bz'].name}
	])
	cmB_ysp.defaultSortable = true;
	var dsB_ysp = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanB,
			business : businessB,
			method : listMethodB,
			params : null
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyB
		}, ColumnsB),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsB_ysp.setDefaultSort(orderColumnB, 'asc');
	var gridPanel_ysp = new Ext.grid.EditorGridTbarPanel({
		title:'已入库',
		ds : dsB_ysp,
		cm : cmB_ysp,
		tbar : [ ],
		border : false,
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
		saveBtn: false,
		addBtn: false,
		delBtn: false,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB_ysp,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		business : businessB,		
		primaryKey : primaryKeyB
	});   
	
	dsB_ysp.baseParams.params = " bill_type='计划入库' and bill_state ='1'";
	dsB_ysp.load({ params:{start: 0, limit: PAGE_SIZE }});

//-------------------------
	var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'center',
        forceFit: true
    });		
    if(isFlwTask==true){
    	tabs.add(gridPanel_output)
    }else{
    	tabs.add(gridPanel_output,gridPanel_spz,gridPanel_ysp)
    }
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[tabs]
    });	
     
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    }; 	
})