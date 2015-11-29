var bean_sqtz = "com.sgepit.pmis.wzgl.hbm.WztzSqjhView";
var primaryKey_sqtz = 'uids';
var orderColumn_sqtz = 'bm';
var fc_sqtz,Columns_sqtz,sm_sqtz,cm_sqtz,ds_sqtz,gridPanel_sqtz;
    
var bean_cgtz = "com.sgepit.pmis.wzgl.hbm.WztzCgjhView";
var primaryKey_cgtz = 'uids';
var orderColumn_cgtz = 'bm';
var fc_cgtz,Columns_cgtz,sm_cgtz,cm_cgtz,ds_cgtz,gridPanel_cgtz;

var bean_rktz = "com.sgepit.pmis.wzgl.hbm.WztzWzrkView";
var primaryKey_rktz = 'uids';
var orderColumn_rktz = 'bm';
var fc_rktz,Columns_rktz,sm_rktz,cm_rktz,ds_rktz,gridPanel_rktz;

var bean_cktz = "com.sgepit.pmis.wzgl.hbm.WztzWzckView";
var primaryKey_cktz = 'uids';
var orderColumn_cktz = 'bm';
var fc_cktz,Columns_cktz,sm_cktz,cm_cktz,ds_cktz,gridPanel_cktz;

Ext.onReady(function(){

	//TODO ===================申请台帐===================
	fc_sqtz = {
		'uids' : {name : 'uids',fieldLabel : '流水号'},
		'pid' : {name : 'pid',fieldLabel : '工程编号'},
		'bh' : {name : 'bh',fieldLabel : '申请计划单号'},
		'bm' : {name : 'bm',fieldLabel : '物资编码'},
		'pm' : {name : 'pm',fieldLabel : '品名'},
		'gg' : {name : 'gg',fieldLabel : '规格型号'},
		'dw' : {name : 'dw',fieldLabel : '单位'},
		'dj' : {name : 'dj',fieldLabel : '计划单价'},
		'sqrq' : {name : 'sqrq',fieldLabel : '申请日期',format : 'Y-m-d'},
		'bmmc' : {name : 'bmmc',fieldLabel : '申请部门'},
		'sqr' : {name : 'sqr',fieldLabel : '申请人'},
		'sqsl' : {name : 'sqsl',fieldLabel : '申请数量'},
		'sqzje' : {name : 'sqzje',fieldLabel : '申请总金额'},
		'ftsl' : {name : 'ftsl',fieldLabel : '分摊数量'},
		'tdsl' : {name : 'tdsl',fieldLabel : '替代数量'},
		'lysl' : {name : 'lysl',fieldLabel : '领用数量'},
		'billState' : {name : 'billState',fieldLabel : '审批状态'}
	};

	Columns_sqtz = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'bh',type : 'string'},
		{name : 'bm',type : 'string'},
		{name : 'pm',type : 'string'},
		{name : 'gg',type : 'string'},
		{name : 'dw',type : 'string'},
		{name : 'dj',type : 'float'},
		{name : 'sqrq',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'bmmc',type : 'string'},
		{name : 'sqr',type : 'string'},
		{name : 'sqsl',type : 'float'},
		{name : 'sqzje',type : 'float'},
		{name : 'ftsl',type : 'float'},
		{name : 'tdsl',type : 'float'},
		{name : 'lysl',type : 'float'}, 
		{name : 'billState',type : 'string'}
    ];
    
	sm_sqtz = new Ext.grid.CheckboxSelectionModel();
	
	cm_sqtz = new Ext.grid.ColumnModel([
		sm_sqtz,
		{id:'uids',header:fc_sqtz['uids'].fieldLabel,dataIndex:fc_sqtz['uids'].name,hidden:true},
		{id:'pid',header:fc_sqtz['pid'].fieldLabel,dataIndex:fc_sqtz['pid'].name,hidden:true},
		{id:'bh',header:fc_sqtz['bh'].fieldLabel,dataIndex:fc_sqtz['bh'].name,width:160},
		{id:'bm',header:fc_sqtz['bm'].fieldLabel,dataIndex:fc_sqtz['bm'].name,align:'center',width:100},
		{id:'pm',header:fc_sqtz['pm'].fieldLabel,dataIndex:fc_sqtz['pm'].name,align:'center',width:100},
		{id:'gg',header:fc_sqtz['gg'].fieldLabel,dataIndex:fc_sqtz['gg'].name,align:'center',width:100},
		{id:'dw',header:fc_sqtz['dw'].fieldLabel,dataIndex:fc_sqtz['dw'].name,align:'center',width:80},
		{id:'dj',header:fc_sqtz['dj'].fieldLabel,dataIndex:fc_sqtz['dj'].name,align:'right',width:80},
		{id:'sqrq',header:fc_sqtz['sqrq'].fieldLabel,dataIndex:fc_sqtz['sqrq'].name,renderer:formatDate,align:'center',width:90},
		{id:'bmmc',header:fc_sqtz['bmmc'].fieldLabel,dataIndex:fc_sqtz['bmmc'].name,align:'center',width:160},
		{id:'sqr',header:fc_sqtz['sqr'].fieldLabel,dataIndex:fc_sqtz['sqr'].name,align:'center',width:100,hidden:true},
		{id:'sqsl',header:fc_sqtz['sqsl'].fieldLabel,dataIndex:fc_sqtz['sqsl'].name,align:'right',width:80},
		{id:'sqzje',header:fc_sqtz['sqzje'].fieldLabel,dataIndex:fc_sqtz['sqzje'].name,align:'right',width:80},
		{id:'ftsl',header:fc_sqtz['ftsl'].fieldLabel,dataIndex:fc_sqtz['ftsl'].name,align:'right',width:80},
		{id:'tdsl',header:fc_sqtz['tdsl'].fieldLabel,dataIndex:fc_sqtz['tdsl'].name,align:'right',width:80,hidden:true},
		{id:'lysl',header:fc_sqtz['lysl'].fieldLabel,dataIndex:fc_sqtz['lysl'].name,align:'right',width:80},
		{id:'billState',header:fc_sqtz['billState'].fieldLabel,dataIndex:fc_sqtz['billState'].name,align:'center',width:80}
	]);

	cm_sqtz.defaultSortable = true;// 可排序

	ds_sqtz = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean_sqtz,
			business : business,
			method : listMethod,
			params : "0>1"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey_sqtz
		}, Columns_sqtz),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds_sqtz.setDefaultSort(orderColumn_sqtz, 'asc');

    var querySQTab = [
		'品名：',
		{id:'sqpm',xtype:'textfield'},
		'-',
		'申请部门：',
		{id:'sqbm',xtype:'textfield'},
		'-',
		'检索时间：',
		new Ext.form.DateField({
			id : 'sqbegin',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '开始时间',
			width : 90
		}),
		'-',
		new Ext.form.DateField({
			id : 'sqend',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '结束时间',
			width : 90
		}),
		'-',
		new Ext.Button({
			text : '检索',
			iconCls : 'btn',
			handler : queryOfSQTZ
		}),
		'->',
		new Ext.Button({
			text : '导出数据',
			iconCls : 'excel',
			handler : exportSQTZ
		})
	];

	function queryOfSQTZ(){
		if(wztzBM){
			ds_sqtz.baseParams.params = "bm='"+wztzBM+"'";
			if(Ext.getCmp('sqpm').getValue()){
				ds_sqtz.baseParams.params +=" and pm like '%"+Ext.getCmp('sqpm').getValue()+"%'";
			}
			if(Ext.getCmp('sqbm').getValue()){
				ds_sqtz.baseParams.params +=" and bmmc like '%"+Ext.getCmp('sqbm').getValue()+"%'";
			}
			if(Ext.getCmp('sqbegin').getValue()){
				ds_sqtz.baseParams.params +=" and sqrq > to_date('"+Ext.util.Format.date(Ext.getCmp('sqbegin').getValue(), 'Ymd')+"','YYYYMMDD')";
			}
			if(Ext.getCmp('sqend').getValue()){
				ds_sqtz.baseParams.params +=" and sqrq < to_date('"+Ext.util.Format.date(Ext.getCmp('sqend').getValue(), 'Ymd')+"','YYYYMMDD')";
			}
			ds_sqtz.load({params:{start:0,limit:PAGE_SIZE}});
		}else{
			return;
		}
	}
	
	function exportSQTZ(){
		if(wztzBM){
			var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=wztzSqtzList&bm="+wztzBM;
	    	if(Ext.getCmp("sqpm").getValue()){
	    		openUrl += "&pm="+Ext.getCmp("sqpm").getValue();
	    	}
	    	if(Ext.getCmp("sqbm").getValue()){
	    		openUrl += "&condition2="+Ext.getCmp("sqbm").getValue();
	    	}
	    	if(Ext.getCmp("sqbegin").getValue()){
	    		openUrl += "&begin="+Ext.util.Format.date(Ext.getCmp('sqbegin').getValue(), 'Ymd');
	    	}
	    	if(Ext.getCmp("sqend").getValue()){
	    		openUrl += "&end="+Ext.util.Format.date(Ext.getCmp('sqend').getValue(), 'Ymd');
	    	}
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
		}else{
			return;
		}
	}
	
	gridPanel_sqtz = new Ext.grid.GridPanel({
		id : '_sqtz',
		ds : ds_sqtz,
		cm : cm_sqtz,
		sm : sm_sqtz,
		border : false,
		title : '申请台帐',
		autoScroll : true,
		tbar : querySQTab,
		loadMask : true,
		stripeRows : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({
			pageSize : PAGE_SIZE,
			store : ds_sqtz,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。",
			items :[
			    '-','申请完成数量：',
			    {id:'_sqtzComp',width:60,xtype:'textfield',readOnly:true},
			    '-','申请中数量：',
			    {id:'_sqtzIng',width:60,xtype:'textfield',readOnly:true}
			]
		})
	});

    //TODO ===================采购台帐===================
	fc_cgtz = {
		'uids' : {name : 'uids',fieldLabel : '流水号'},
		'pid' : {name : 'pid',fieldLabel : '工程编号'},
		'bh' : {name : 'bh',fieldLabel : '采购计划编号'},
		'bm' : {name : 'bm',fieldLabel : '物资编码'},
		'pm' : {name : 'pm',fieldLabel : '品名'},
		'gg' : {name : 'gg',fieldLabel : '规格型号'},
		'dw' : {name : 'dw',fieldLabel : '单位'},
		'dj' : {name : 'dj',fieldLabel : '单价'},
		'rq' : {name : 'rq',fieldLabel : '计划日期',format : 'Y-m-d'},
		'jhr' : {name : 'jhr',fieldLabel : '稽核员'},
		'kykc' : {name : 'kykc',fieldLabel : '可用库存'},
		'cgsl' : {name : 'cgsl',fieldLabel : '采购数量'},
		'zj' : {name : 'zj',fieldLabel : '总价'},
		'billState' : {name : 'billState',fieldLabel : '审批状态'}
	};

	Columns_cgtz = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'bh',type : 'string'},
		{name : 'bm',type : 'string'},
		{name : 'pm',type : 'string'},
		{name : 'gg',type : 'string'},
		{name : 'dw',type : 'string'},
		{name : 'dj',type : 'float'},
		{name : 'rq',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'jhr',type : 'string'},
		{name : 'kykc',type : 'float'},
		{name : 'cgsl',type : 'float'},
		{name : 'zj',type : 'float'},
		{name : 'billState',type : 'string'}
	];

	sm_cgtz = new Ext.grid.CheckboxSelectionModel();

	cm_cgtz = new Ext.grid.ColumnModel([
		sm_cgtz,
		{id:'uids',header:fc_cgtz['uids'].fieldLabel,dataIndex:fc_cgtz['uids'].name,hidden:true},
		{id:'pid',header:fc_cgtz['pid'].fieldLabel,dataIndex:fc_cgtz['pid'].name,hidden:true},
		{id:'bh',header:fc_cgtz['bh'].fieldLabel,dataIndex:fc_cgtz['bh'].name,width:160},
		{id:'bm',header:fc_cgtz['bm'].fieldLabel,dataIndex:fc_cgtz['bm'].name,align:'center',width:100},
		{id:'pm',header:fc_cgtz['pm'].fieldLabel,dataIndex:fc_cgtz['pm'].name,align:'center',width:100},
		{id:'gg',header:fc_cgtz['gg'].fieldLabel,dataIndex:fc_cgtz['gg'].name,align:'center',width:100},
		{id:'dw',header:fc_cgtz['dw'].fieldLabel,dataIndex:fc_cgtz['dw'].name,align:'center',width:80},
		{id:'dj',header:fc_cgtz['dj'].fieldLabel,dataIndex:fc_cgtz['dj'].name,align:'right',width:80},
		{id:'rq',header:fc_cgtz['rq'].fieldLabel,dataIndex:fc_cgtz['rq'].name,renderer:formatDate,align:'center',width:90},
		{id:'jhr',header:fc_cgtz['jhr'].fieldLabel,dataIndex:fc_cgtz['jhr'].name,align:'center',width:100},
		{id:'kykc',header:fc_cgtz['kykc'].fieldLabel,dataIndex:fc_cgtz['kykc'].name,align:'right',width:80},
		{id:'cgsl',header:fc_cgtz['cgsl'].fieldLabel,dataIndex:fc_cgtz['cgsl'].name,align:'right',width:80},
		{id:'zj',header:fc_cgtz['zj'].fieldLabel,dataIndex:fc_cgtz['zj'].name,align:'right',width:80},
		{id:'billState',header:fc_cgtz['billState'].fieldLabel,dataIndex:fc_cgtz['billState'].name,align:'center',width:80}
	]);

	cm_cgtz.defaultSortable = true;// 可排序

	ds_cgtz = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : bean_cgtz,
            business : business,
            method : listMethod,
            params : "0>1"
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : primaryKey_cgtz
        }, Columns_cgtz),
        remoteSort : true,
        pruneModifiedRecords : true
    });
    ds_cgtz.setDefaultSort(orderColumn_cgtz, 'asc');

	var queryCGTab = [
		'品名：',
		{id:'cgpm',xtype:'textfield'},
		'-',
		'稽核员：',
		{id:'cgjhy',xtype:'textfield'},
		'-',
		'检索时间：',
		new Ext.form.DateField({
			id : 'cgbegin',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '开始时间',
			width : 90
		}),
		'-',
		new Ext.form.DateField({
			id : 'cgend',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '结束时间',
			width : 90
		}),
		'-',
		new Ext.Button({
			text : '检索',
			iconCls : 'btn',
			handler : queryOfCGTZ
		}),
		'->',
		new Ext.Button({
			text : '导出数据',
			iconCls : 'excel',
			handler : exportCGTZ
		})
	];

	function queryOfCGTZ(){
		if(wztzBM){
			ds_cgtz.baseParams.params = "bm='"+wztzBM+"'";
			if(Ext.getCmp('cgpm').getValue()){
				ds_cgtz.baseParams.params +=" and pm like '%"+Ext.getCmp('cgpm').getValue()+"%'";
			}
			if(Ext.getCmp('cgjhy').getValue()){
				ds_cgtz.baseParams.params +=" and jhr like '%"+Ext.getCmp('cgjhy').getValue()+"%'";
			}
			if(Ext.getCmp('cgbegin').getValue()){
				ds_cgtz.baseParams.params +=" and rq > to_date('"+Ext.util.Format.date(Ext.getCmp('cgbegin').getValue(), 'Ymd')+"','YYYYMMDD')";
			}
			if(Ext.getCmp('cgend').getValue()){
				ds_cgtz.baseParams.params +=" and rq < to_date('"+Ext.util.Format.date(Ext.getCmp('cgend').getValue(), 'Ymd')+"','YYYYMMDD')";
			}
			ds_cgtz.load({params:{start:0,limit:PAGE_SIZE}});
		}else{
			return;
		}
	}
	
	function exportCGTZ(){
		if(wztzBM){
			var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=wztzCgtzList&bm="+wztzBM;
	    	if(Ext.getCmp("cgpm").getValue()){
	    		openUrl += "&pm="+Ext.getCmp("cgpm").getValue();
	    	}
	    	if(Ext.getCmp("cgjhy").getValue()){
	    		openUrl += "&condition2="+Ext.getCmp("cgjhy").getValue();
	    	}
	    	if(Ext.getCmp("cgbegin").getValue()){
	    		openUrl += "&begin="+Ext.util.Format.date(Ext.getCmp('cgbegin').getValue(), 'Ymd');
	    	}
	    	if(Ext.getCmp("cgend").getValue()){
	    		openUrl += "&end="+Ext.util.Format.date(Ext.getCmp('cgend').getValue(), 'Ymd');
	    	}
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
		}else{
			return;
		}
	}

	gridPanel_cgtz = new Ext.grid.GridPanel({
		id : '_cgtz',
		ds : ds_cgtz,
		cm : cm_cgtz,
		sm : sm_cgtz,
		border : false,
		title : '采购台帐',
		autoScroll : true,
		tbar : queryCGTab,
		loadMask : true,
		stripeRows : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({
			pageSize : PAGE_SIZE,
			store : ds_cgtz,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。",
			items :[
				'-','稽核完成数量：',
				{id:'_cgtzComp',width:60,xtype:'textfield',readOnly:true},
				'-','稽核中数量：',
				{id:'_cgtzIng',width:60,xtype:'textfield',readOnly:true}
			]
		})
	});
    
    //TODO ===================入库台帐===================
	fc_rktz = {
		'uids' : {name : 'uids',fieldLabel : '流水号'},
		'pid' : {name : 'pid',fieldLabel : '工程编号'},
		'bh' : {name : 'bh',fieldLabel : '入库单号'},
		'bm' : {name : 'bm',fieldLabel : '物资编码'},
		'pm' : {name : 'pm',fieldLabel : '品名'},
		'gg' : {name : 'gg',fieldLabel : '规格型号'},
		'dw' : {name : 'dw',fieldLabel : '单位'},
		'dj' : {name : 'dj',fieldLabel : '单价'},
		'rkrq' : {name : 'rkrq',fieldLabel : '入库日期',format : 'Y-m-d'},
		'jsr' : {name : 'jsr',fieldLabel : '经手人'},
		'rksl' : {name : 'rksl',fieldLabel : '入库数量'},
		'zj' : {name : 'zj',fieldLabel : '总价'},
		'billState' : {name : 'billState',fieldLabel : '审批状态'}
	};

	Columns_rktz = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'bh',type : 'string'},
		{name : 'bm',type : 'string'},
		{name : 'pm',type : 'string'},
		{name : 'gg',type : 'string'},
		{name : 'dw',type : 'string'},
		{name : 'dj',type : 'float'},
		{name : 'rkrq',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'jsr',type : 'string'},
		{name : 'rksl',type : 'float'},
		{name : 'zj',type : 'float'},
		{name : 'billState',type : 'string'}
	]

	sm_rktz = new Ext.grid.CheckboxSelectionModel();

	cm_rktz = new Ext.grid.ColumnModel([
		sm_rktz,
		{id:'uids',header:fc_rktz['uids'].fieldLabel,dataIndex:fc_rktz['uids'].name,hidden:true},
		{id:'pid',header:fc_rktz['pid'].fieldLabel,dataIndex:fc_rktz['pid'].name,hidden:true},
		{id:'bh',header:fc_rktz['bh'].fieldLabel,dataIndex:fc_rktz['bh'].name,width:160},
		{id:'bm',header:fc_rktz['bm'].fieldLabel,dataIndex:fc_rktz['bm'].name,align:'center',width:100},
		{id:'pm',header:fc_rktz['pm'].fieldLabel,dataIndex:fc_rktz['pm'].name,align:'center',width:100},
		{id:'gg',header:fc_rktz['gg'].fieldLabel,dataIndex:fc_rktz['gg'].name,align:'center',width:100},
		{id:'dw',header:fc_rktz['dw'].fieldLabel,dataIndex:fc_rktz['dw'].name,align:'center',width:80},
		{id:'dj',header:fc_rktz['dj'].fieldLabel,dataIndex:fc_rktz['dj'].name,align:'right',width:80},
		{id:'rkrq',header:fc_rktz['rkrq'].fieldLabel,dataIndex:fc_rktz['rkrq'].name,renderer:formatDate,align:'center',width:90},
		{id:'jsr',header:fc_rktz['jsr'].fieldLabel,dataIndex:fc_rktz['jsr'].name,align:'center',width:100},
		{id:'rksl',header:fc_rktz['rksl'].fieldLabel,dataIndex:fc_rktz['rksl'].name,align:'right',width:80},
		{id:'zj',header:fc_rktz['zj'].fieldLabel,dataIndex:fc_rktz['zj'].name,align:'right',width:80},
		{id:'billState',header:fc_rktz['billState'].fieldLabel,dataIndex:fc_rktz['billState'].name,align:'center',width:80}
	]);

	cm_rktz.defaultSortable = true;// 可排序

	ds_rktz = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean_rktz,
			business : business,
			method : listMethod,
			params : "0>1"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey_rktz
		}, Columns_rktz),
		remoteSort : true,
		pruneModifiedRecords : true
    });

    ds_rktz.setDefaultSort(orderColumn_rktz, 'asc');

	var queryRKTab = [
		'品名：',
		{id:'rkpm',xtype:'textfield'},
		'-',
		'经手人：',
		{id:'rkjsr',xtype:'textfield'},
		'-',
		'检索时间：',
		new Ext.form.DateField({
			id : 'rkbegin',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '开始时间',
			width : 90
		}),
		'-',
		new Ext.form.DateField({
			id : 'rkend',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '结束时间',
			width : 90
		}),
		'-',
		new Ext.Button({
			text : '检索',
			iconCls : 'btn',
			handler : queryOfRKTZ
		}),
		'->',
		new Ext.Button({
			text : '导出数据',
			iconCls : 'excel',
			handler : exportRKTZ
		})
	];

	function queryOfRKTZ(){
		if(wztzBM){
			ds_rktz.baseParams.params = "bm='"+wztzBM+"'";
			if(Ext.getCmp('rkpm').getValue()){
				ds_rktz.baseParams.params +=" and pm like '%"+Ext.getCmp('rkpm').getValue()+"%'";
			}
			if(Ext.getCmp('rkjsr').getValue()){
				ds_rktz.baseParams.params +=" and jsr like '%"+Ext.getCmp('rkjsr').getValue()+"%'";
			}
			if(Ext.getCmp('rkbegin').getValue()){
				ds_rktz.baseParams.params +=" and rkrq > to_date('"+Ext.util.Format.date(Ext.getCmp('rkbegin').getValue(), 'Y-m-d')+"','YYYY-MM-DD')";
			}
			if(Ext.getCmp('rkend').getValue()){
				ds_rktz.baseParams.params +=" and rkrq < to_date('"+Ext.util.Format.date(Ext.getCmp('rkend').getValue(), 'Y-m-d')+"','YYYY-MM-DD')";
			}
			ds_rktz.load({params:{start:0,limit:PAGE_SIZE}});
		}else{
			return;
		}
	}
	
	function exportRKTZ(){
		if(wztzBM){
			var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=wztzRktzList&bm="+wztzBM;
	    	if(Ext.getCmp("rkpm").getValue()){
	    		openUrl += "&pm="+Ext.getCmp("rkpm").getValue();
	    	}
	    	if(Ext.getCmp("rkjsr").getValue()){
	    		openUrl += "&condition2="+Ext.getCmp("rkjsr").getValue();
	    	}
	    	if(Ext.getCmp("rkbegin").getValue()){
	    		openUrl += "&begin="+Ext.util.Format.date(Ext.getCmp('rkbegin').getValue(), 'Ymd');
	    	}
	    	if(Ext.getCmp("rkend").getValue()){
	    		openUrl += "&end="+Ext.util.Format.date(Ext.getCmp('rkend').getValue(), 'Ymd');
	    	}
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
		}else{
			return;
		}
	}

	gridPanel_rktz = new Ext.grid.GridPanel({
		id : '_rktz',
		ds : ds_rktz,
		cm : cm_rktz,
		sm : sm_rktz,
		border : false,
		title : '入库台帐',
		autoScroll : true,
		tbar : queryRKTab,
		loadMask : true,
		stripeRows : true,
		viewConfig : {
		forceFit : false,
		ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({
			pageSize : PAGE_SIZE,
			store : ds_rktz,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。",
			items :[
				'-','入库完成数量：',
				{id:'_rktzComp',width:60,xtype:'textfield',readOnly:true},
				'-','入库中数量：',
				{id:'_rktzIng',width:60,xtype:'textfield',readOnly:true}
			]
		})
	});

    //TODO ===================出库台帐===================
	fc_cktz = {
		'uids' : {name : 'uids',fieldLabel : '流水号'},
		'pid' : {name : 'pid',fieldLabel : '工程编号'},
		'bh' : {name : 'bh',fieldLabel : '出库单号'},
		'bm' : {name : 'bm',fieldLabel : '物资编码'},
		'pm' : {name : 'pm',fieldLabel : '品名'},
		'gg' : {name : 'gg',fieldLabel : '规格型号'},
		'dw' : {name : 'dw',fieldLabel : '单位'},
		'dj' : {name : 'dj',fieldLabel : '单价'},
		'ckrq' : {name : 'ckrq',fieldLabel : '出库日期',format : 'Y-m-d'},
		'lybm' : {name : 'lybm',fieldLabel : '领用部门'},
		'lyr' : {name : 'lyr',fieldLabel : '领用人'},
		'lysl' : {name : 'lysl',fieldLabel : '领用数量'},
		'zj' : {name : 'zj',fieldLabel : '总价'},
		'billState' : {name : 'billState',fieldLabel : '审批状态'}
	};

	Columns_cktz = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'bh',type : 'string'},
		{name : 'bm',type : 'string'},
		{name : 'pm',type : 'string'},
		{name : 'gg',type : 'string'},
		{name : 'dw',type : 'string'},
		{name : 'dj',type : 'float'},
		{name : 'ckrq',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'lybm',type : 'string'},
		{name : 'lyr',type : 'string'},
		{name : 'lysl',type : 'float'},
		{name : 'zj',type : 'float'},
		{name : 'billState',type : 'string'}
	];

    sm_cktz = new Ext.grid.CheckboxSelectionModel();

	cm_cktz = new Ext.grid.ColumnModel([
		sm_cktz,
		{id:'uids',header:fc_cktz['uids'].fieldLabel,dataIndex:fc_cktz['uids'].name,hidden:true},
		{id:'pid',header:fc_cktz['pid'].fieldLabel,dataIndex:fc_cktz['pid'].name,hidden:true},
		{id:'bh',header:fc_cktz['bh'].fieldLabel,dataIndex:fc_cktz['bh'].name,width:160},
		{id:'bm',header:fc_cktz['bm'].fieldLabel,dataIndex:fc_cktz['bm'].name,align:'center',width:100},
		{id:'pm',header:fc_cktz['pm'].fieldLabel,dataIndex:fc_cktz['pm'].name,align:'center',width:100},
		{id:'gg',header:fc_cktz['gg'].fieldLabel,dataIndex:fc_cktz['gg'].name,align:'center',width:100},
		{id:'dw',header:fc_cktz['dw'].fieldLabel,dataIndex:fc_cktz['dw'].name,align:'center',width:80},
		{id:'dj',header:fc_cktz['dj'].fieldLabel,dataIndex:fc_cktz['dj'].name,align:'right',width:80},
		{id:'ckrq',header:fc_cktz['ckrq'].fieldLabel,dataIndex:fc_cktz['ckrq'].name,renderer:formatDate,align:'center',width:90},
		{id:'lybm',header:fc_cktz['lybm'].fieldLabel,dataIndex:fc_cktz['lybm'].name,align:'center',width:100},
		{id:'lyr',header:fc_cktz['lyr'].fieldLabel,dataIndex:fc_cktz['lyr'].name,align:'center',hidden:true,width:100},
		{id:'lysl',header:fc_cktz['lysl'].fieldLabel,dataIndex:fc_cktz['lysl'].name,align:'right',width:80},
		{id:'zj',header:fc_cktz['zj'].fieldLabel,dataIndex:fc_cktz['zj'].name,align:'right',width:80},
		{id:'billState',header:fc_cktz['billState'].fieldLabel,dataIndex:fc_cktz['billState'].name,align:'center',width:80}
	]);
	
	cm_cktz.defaultSortable = true;// 可排序

	ds_cktz = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean_cktz,
			business : business,
			method : listMethod,
			params : "0>1"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey_cktz
		}, Columns_cktz),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	ds_cktz.setDefaultSort(orderColumn_cktz, 'asc');

	var queryCKTab = [
		'品名：',
		{id:'ckpm',xtype:'textfield'},
		'-',
		'领用部门：',
		{id:'cklybm',xtype:'textfield'},
		'-',
		'检索时间：',
		new Ext.form.DateField({
			id : 'ckbegin',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '开始时间',
			width : 90
		}),
		'-',
		new Ext.form.DateField({
			id : 'ckend',
			format : 'Y-m-d',
			minValue : '2000-01-01', 
			emptyText : '结束时间',
			width : 90
		}),
		'-',
		new Ext.Button({
			text : '检索',
			iconCls : 'btn',
			handler : queryOfCKTZ
		}),
		'->',
		new Ext.Button({
			text : '导出数据',
			iconCls : 'excel',
			handler : exportCKTZ
		})
	];

	function queryOfCKTZ(){
		if(wztzBM){
			ds_cktz.baseParams.params = "bm='"+wztzBM+"'";
			if(Ext.getCmp('ckpm').getValue()){
				ds_cktz.baseParams.params +=" and pm like '%"+Ext.getCmp('ckpm').getValue()+"%'";
			}
			if(Ext.getCmp('cklybm').getValue()){
				ds_cktz.baseParams.params +=" and lybm like '%"+Ext.getCmp('cklybm').getValue()+"%'";
			}
			if(Ext.getCmp('ckbegin').getValue()){
				ds_cktz.baseParams.params +=" and ckrq > to_date('"+Ext.util.Format.date(Ext.getCmp('ckbegin').getValue(), 'Y-m-d')+"','YYYY-MM-DD')";
			}
			if(Ext.getCmp('ckend').getValue()){
				ds_cktz.baseParams.params +=" and ckrq < to_date('"+Ext.util.Format.date(Ext.getCmp('ckend').getValue(), 'Y-m-d')+"','YYYY-MM-DD')";
			}
			ds_cktz.load({params:{start:0,limit:PAGE_SIZE}});
		}else{
			return;
		}
	}
	
	function exportCKTZ(){
		if(wztzBM){
			var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=wztzCktzList&bm="+wztzBM;
	    	if(Ext.getCmp("ckpm").getValue()){
	    		openUrl += "&pm="+Ext.getCmp("ckpm").getValue();
	    	}
	    	if(Ext.getCmp("cklybm").getValue()){
	    		openUrl += "&condition2="+Ext.getCmp("cklybm").getValue();
	    	}
	    	if(Ext.getCmp("ckbegin").getValue()){
	    		openUrl += "&begin="+Ext.util.Format.date(Ext.getCmp('ckbegin').getValue(), 'Ymd');
	    	}
	    	if(Ext.getCmp("ckend").getValue()){
	    		openUrl += "&end="+Ext.util.Format.date(Ext.getCmp('ckend').getValue(), 'Ymd');
	    	}
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
		}else{
			return;
		}
	}

	gridPanel_cktz = new Ext.grid.GridPanel({
		id : '_cktz',
		ds : ds_cktz,
		cm : cm_cktz,
		sm : sm_cktz,
		border : false,
		title : '出库台帐',
		autoScroll : true,
		tbar : queryCKTab,
		loadMask : true,
		stripeRows : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({
			pageSize : PAGE_SIZE,
			store : ds_cktz,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。",
			items :[
			    '-','出库完成数量：',
			    {id:'_cktzComp',width:60,xtype:'textfield',readOnly:true},
			    '-','出库中数量：',
			    {id:'_cktzIng',width:60,xtype:'textfield',readOnly:true}
			]
		})
	});
    
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	}
	
});