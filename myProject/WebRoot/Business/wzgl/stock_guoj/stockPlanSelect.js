var matServlet =  CONTEXT_PATH + "/servlet/MatServlet"
var whereStr = "substr(flbm,1,5) in (select BM from wz_user_ckclb where USERID='" + USERID + "') "
             + "and bm not in (select bm from wz_cjhxb where BH='" + buyId + "') and pid='"+CURRENTAPPID+"' "
var dsB
var unit_Array=new Array()
Ext.onReady(function() {	
		DWREngine.setAsync(false);
	 	baseMgm.getData('select unitid,unitname from sgcc_ini_unit',function(list){ 
 		var unitblank =new Array()
 		unitblank.push("all")
 		unitblank.push("全部")
 		unit_Array.push(unitblank)
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			unit_Array.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 		 unitSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : unit_Array
	});
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
		    history.back();
		}
	});
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'select',
		handler: select
	});
	
	var btnListAll = new Ext.Button({
		text: '列出所有',
		iconCls: 'refresh',
		handler: listAll
	});    
	
	var fm = Ext.form;			// 包名简写（缩写）
	var fcB = { 
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',  
			hideLabel : true
		},'bm' : {  
			name : 'bm',
			fieldLabel : '物资编码',  
			anchor : '95%'
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
		},'dj' : {
			name : 'dj',
			fieldLabel : '单价',
			anchor : '95%'
		},'kcsl' : {
			name : 'kcsl',
			fieldLabel : '实际库存',
			anchor : '95%'
		},'kysl' : {  
			name : 'kysl',
			fieldLabel : '可用库存',  
			anchor : '95%'
		},'sl' : {  
			name : 'sl',
			fieldLabel : '申请数量',  
			anchor : '95%'
		},'ygsl' : {  
			name : 'ygsl',
			fieldLabel : '应购数量',
			anchor : '95%'
		},'bmmc' : {  
			name : 'bmmc',
			fieldLabel : '需求部门',
			anchor : '95%'
		},'xqrq' : {  
			name : 'xqrq',
			fieldLabel : '需求日期',  
			anchor : '95%'
		},'bh' : {  
			name : 'bh',
			fieldLabel : '申请计划编号',  
			anchor : '95%'
		},'pid' : {  
			name : 'pid',
			fieldLabel : 'PID',  
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uids', type: 'string'},
    	{name: 'bm', type: 'string'},    		
		{name: 'pm', type: 'string'},
		{name: 'gg', type: 'string'},  	
		{name: 'dw', type: 'string'},
		{name: 'dj', type: 'float'},
		{name: 'kcsl', type: 'float'},	
		{name: 'kysl', type: 'float'},		
		{name: 'sl', type: 'float'},
		{name: 'ygsl', type: 'float'},	
		{name: 'bmmc', type: 'string'},	
		{name: 'bh', type: 'string'},	
		{name: 'pid', type: 'string'},
		{name: 'xqrq',  type: 'date', dateFormat: 'Y-m-d H:i:s'}
		
	];
	var smB = new Ext.grid.CheckboxSelectionModel()
	//-----------------------------------------从grid begin-------------------------
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uids',
		header : fcB['uids'].fieldLabel,
		dataIndex : fcB['uids'].name,
		hidden : true
	},{
		id : 'bm',
		header : fcB['bm'].fieldLabel,
		dataIndex : fcB['bm'].name
	}, {
		id : 'pm',
		header : fcB['pm'].fieldLabel,
		dataIndex : fcB['pm'].name
	}, {
		id : 'gg',
		header : fcB['gg'].fieldLabel,
		dataIndex : fcB['gg'].name
	}, {
		id : 'dj',
		header : fcB['dj'].fieldLabel,
		dataIndex : fcB['dj'].name
	}, {
		id : 'kcsl',
		header : fcB['kcsl'].fieldLabel,
		dataIndex : fcB['kcsl'].name
	},  {
		id : 'kysl',
		header : fcB['kysl'].fieldLabel,
		dataIndex : fcB['kysl'].name
	}, {
		id : 'sl',
		header : fcB['sl'].fieldLabel,
		dataIndex : fcB['sl'].name
	}, {
		id : 'ygsl',
		header : fcB['ygsl'].fieldLabel,
		dataIndex : fcB['ygsl'].name
	},{
		id : 'xqrq',
		header : fcB['xqrq'].fieldLabel,
		dataIndex : fcB['xqrq'].name,
		renderer: formatDate
	}, {
		id : 'bmmc',
		header : fcB['bmmc'].fieldLabel,
		dataIndex : fcB['bmmc'].name,
		renderer:function(value){
			for(var i = 0;i<unit_Array.length;i++){
					if(value == unit_Array[i][0]){
						return unit_Array[i][1]
					}
				}
		}
	}, {
		id : 'bh',
		header : fcB['bh'].fieldLabel,
		dataIndex : fcB['bh'].name
	}, {
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden : true
	}
	])
	cmB.defaultSortable = true;
	
	dsB = new Ext.data.Store({
		baseParams : {
			ac : 'listCollectApply',
			whereStr : whereStr
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : matServlet
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, ColumnsB),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsB.setDefaultSort("bm", 'asc');
	var gridPanelB = new Ext.grid.GridPanel({
		id : 'ff-gridB-panel',
		region: 'center',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [btnSelect, '-', btnListAll],
		border : false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		loadMask : true, // 加载时是否显示进度
		height: 240, 
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
		})
	});
	
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanelB]
	});
	dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
    function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
   
    
  
   	
   	// 选择要形成采购计划的物资
 	function select(){
 		if (smB.hasSelection()){
   			//Ext.get('loading-mask').show();
   			var records = smB.getSelections()
   			var matIds = new Array();
   			var applyBHs = new Array();
   			
   			for (var i=0; i<records.length; i++){
   				matIds.push(records[i].get('bm'))
   				applyBHs.push(records[i].get('bh'))
   			}
	 		DWREngine.setAsync(false);   
		    stockMgm.collectApplyAndCreateStock(buyId, matIds.join(";"),applyBHs.join(";"), function(rtnData){
		    	if(rtnData){
		    		//Ext.MessageBox.alert("提示","申请计划汇总成功")
		    		//Ext.get('loading-mask').hide();
		    		parent.selectWin.close();
		    		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
		    	} else{
		    		Ext.MessageBox.alert("提示","汇总失败！")
		    	}
		    	
		    })
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条申请计划',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
 	}
 	
 	// 选择所有形成采购计划的物资
 	function selectAll(){
 	
 	}
 	
 	// 列出所有物资
 	function listAll(){ 	
 		dsB.load({ params:{start: null, limit: null }});
 	}
 	
 	
});

