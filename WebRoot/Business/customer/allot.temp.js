//equ.goods.urge.js

﻿var beanCont = "com.sgepit.pmis.equipment.hbm.EquContView"
var businessCont = "baseMgm"
var listMethodCont = "findWhereOrderby"
var primaryKeyCont = "conid"
var orderColumnCont = "conno"

﻿var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsUrgeView"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "remindDate"

﻿var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsUrge"
var businessSub = "baseMgm"
var listMethodSub = "findWhereOrderby"
var primaryKeySub = "uids"
var orderColumnSub = "uids"

var dsJz;
var smJz;

Ext.onReady(function() {
	var topPanelName = CURRENTAPPID == "1031902"? "设备/材料催交":"设备催交";
	DWREngine.setAsync(false);
	//查询出到了提醒范围的合同和设备
	var conidStr = " and 1=1 ";
	if(remind=="true"){
		var sql="select distinct j.conid " +
			" from EQU_GOODS_URGE_VIEW j,equ_goods_urge_remind r " +
			" where j.remind_date <= to_date(to_char(sysdate,'YYYY-MM-DD'),'YYYY-MM-DD') " +
			" and j.uids = r.jz_date_id and j.finished = '0' " +
			" and r.userid = '"+USERID+"' order by j.conid";
		var str = "";
		baseDao.getDataAutoCloseSes(sql,function(list){
			for(var i=0;i<list.length;i++){
				str += ",'"+list[i]+"'";
			}
		});
		str = str.substring(1);
		conidStr = " and conid in("+str+")";
	}
	
	//合同分类二
    var contSort2 = new Array();
    appMgm.getCodeValue("设备合同", function(list){
    	for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			contSort2.push(temp);
		}
    });
    
	var partBs= new Array();
	conpartybMgm.getPartyB(function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
    DWREngine.setAsync(true);
	var contSort2Ds = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : contSort2
	})
	var fm = Ext.form;
	
	// TODO : ======合同列表======
	var smCont = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});

	var fcCont = {
		'conid' : {name : 'conid', fieldLabel : '合同主键'},
		'pid' : {name : 'pid', ieldLabel : 'PID'},
		'conno' : {name : 'conno', fieldLabel : '合同编号'},
		'conname' : {name : 'conname', fieldLabel : '<div align="left">合同列表</div>'}
	}

	var cmCont = new Ext.grid.ColumnModel([ // 创建列模型
		// smCont,
		new Ext.grid.RowNumberer({
			//header : '序号',
			width : 20
		}),
		{
			id : 'conid',
			header : fcCont['conid'].fieldLabel,
			dataIndex : fcCont['conid'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fcCont['pid'].fieldLabel,
			dataIndex : fcCont['pid'].name,
			hidden : true
		}, {
			id : 'conno',
			header : fcCont['conno'].fieldLabel,
			dataIndex : fcCont['conno'].name,
			hidden : true
		}, {
			id : 'conname',
			header : fcCont['conname'].fieldLabel,
			dataIndex : fcCont['conname'].name,
			renderer : function(v, m, r) {
				var conno = r.get('conno');
				return conno+"["+v+"]";
			},
			width : 580
		}
	]);
	cmCont.defaultSortable = true;
	var ColumnsCont = [
		{name : 'conid',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'conno',type : 'string'},
		{name : 'conname',type : 'string'}
	];

	var dsCont = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanCont,
			business : businessCont,
			method : listMethodCont,
			params : "pid='" + CURRENTAPPID + "' "+conidStr
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyCont
		}, ColumnsCont),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsCont.setDefaultSort(orderColumnCont, 'asc');

	var contGridPanel = new Ext.grid.GridPanel({
		ds : dsCont,
		cm : cmCont,
		sm : smCont,
		width : 260,
		header : false,
		region : 'west',
		stripeRows : true,
		loadMask : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		}
	});
	
	
	// TODO : ======设备催交======
	smJz = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var fcJz = {
		'uids' : {name : 'uids', fieldLabel : '主键'},
		'pid' : {name : 'pid', fieldLabel : 'PID'},
		'finished' : {name : 'finished', fieldLabel : '完结'},
		'remindDate' : {name : 'remindDate', fieldLabel : '提醒时间', format: 'Y-m-d', readOnly : true},
		'remindRange' : {name : 'remindRange', fieldLabel : '提醒范围'},
		'conid' : {name : 'conid', fieldLabel : '合同主键'},
		'conname' : {name : 'conname', fieldLabel : '合同名称'},
		'sort' : {name : 'sort', fieldLabel : '合同分类二'},
		'partybno' : {name : 'partybno', fieldLabel : '供货厂家'},
		'receivedate' : {name : 'receivedate', fieldLabel : '合同接收日期', format: 'Y-m-d', readOnly : true},
		'planuser' : {name : 'planuser', fieldLabel : '责任计划员'},
		'storageuser' : {name : 'storageuser', fieldLabel : '责任库管员'},
		'jzName' : {name : 'jzName', fieldLabel : '机组名称'},
		'sbName' : {name : 'sbName', fieldLabel : '主设备名称'},
		'startDate' : {name : 'startDate', fieldLabel : '交货起始日期', format: 'Y-m-d', readOnly : true},
		'endDate' : {name : 'endDate', fieldLabel : '交货截止日期', format: 'Y-m-d', readOnly : true}
	}

	var cmJz = new Ext.grid.ColumnModel([ // 创建列模型
		// smJz,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcJz['uids'].fieldLabel,
			dataIndex : fcJz['uids'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fcJz['pid'].fieldLabel,
			dataIndex : fcJz['pid'].name,
			hidden : true
		}, {
			id : 'finished',
			header : fcJz['finished'].fieldLabel,
			dataIndex : fcJz['finished'].name,
			renderer : function(v,m,r){
				var str = "<input type='checkbox' "+(v==1?"checked disabled title='已完结' ":"title='未完结'")+" onclick='finishUrge(\""+r.get("uids")+"\",this)'>"
				return str;
			},
			width : 40
		}, {
			id : 'remindDate',
			header : fcJz['remindDate'].fieldLabel,
			dataIndex : fcJz['remindDate'].name,
			editor : new fm.DateField(fcJz['remindDate']),
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				return formatDate(v)
			},
			align : 'center',
			width : 100
		}, {
			id : 'remindRange',
			header : fcJz['remindRange'].fieldLabel,
			dataIndex : fcJz['remindRange'].name,
			renderer : function(v,m,r){
				if(r.get("finished") != "1")
					m.attr = "style=background-color:#FBF8BF";
				if(v=='已设置'){
					return '<div style="color:blue;">已设置</div>';
				}else{
					return '<div style="color:red;">未设置</div>';
				}
			},
			editor : new fm.TriggerField({
				triggerClass: 'x-form-date-trigger',
				readOnly: true, 
				selectOnFocus: true,
				onTriggerClick: function(){
					remindRangeWin.show();
				}
			}),
			align : 'center',
			width : 100
		}, {
			id : 'conid',
			header : fcJz['conid'].fieldLabel,
			dataIndex : fcJz['conid'].name,
			hidden : true
		}, {
			id : 'conname',
			header : fcJz['conname'].fieldLabel,
			dataIndex : fcJz['conname'].name,
			width : 280,
			renderer : function(v,m,r){
				var conid = r.get('conid');
				var output ="<a title='"+v+"' style='color:blue;' " +
						"href=jjxm/Business/contract/cont.generalInfo.view.jsp?conid="+conid+"&query=true\>"+v+"</a>"		
				return output;           
           },
           type : 'string'
		},{
        	id : 'sort',
        	header: fcJz['sort'].fieldLabel,
           	dataIndex: fcJz['sort'].name,
           	store:contSort2Ds,
           	renderer : function(value){
           		var str = '';
		   		for(var i=0; i<contSort2.length; i++) {
		   			if (contSort2[i][0] == value) {
		   				str = contSort2[i][1]
		   				break; 
		   			}
		   		}
		   		return str;
           	},
           	align: 'center',
           	width: 80,
           	type : 'combo'
		},{
           id: 'partybno',
           header: fcJz['partybno'].fieldLabel,
           dataIndex: fcJz['partybno'].name,
           renderer: function(value){
		   		var str = '';
		   		for(var i=0; i<partBs.length; i++) {
		   			if (partBs[i][0] == value) {
		   				str = partBs[i][1]
		   				break; 
		   			}
		   		}
		   		return str;
		   	},
           width: 220
        },{
			id: 'receivedate',
			header: fcJz['receivedate'].fieldLabel,
			dataIndex: fcJz['receivedate'].name,
			renderer : formatDate,
			align: 'center',
			width: 100
		},{
			id: 'planuser',
			header: fcJz['planuser'].fieldLabel,
			dataIndex: fcJz['planuser'].name,
			align: 'center',
			width: 100,
			type : 'string'
		},{
			id: 'storageuser',
			header: fcJz['storageuser'].fieldLabel,
			dataIndex: fcJz['storageuser'].name,
			align: 'center',
			width: 100,
			type : 'string'
        },{
			id:'jzName',
			header: fcJz['jzName'].fieldLabel,
			dataIndex: fcJz['jzName'].name,
			align : 'center',
			width : 80,
			type : 'string'
		},{
			id:'sbName',
			header: fcJz['sbName'].fieldLabel,
			dataIndex: fcJz['sbName'].name,
			width : 220,
			type : 'string'
		},{
			id:'startDate',
			header: fcJz['startDate'].fieldLabel,
			dataIndex: fcJz['startDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 100,
			type : 'date'
		},{
			id:'endDate',
			header: fcJz['endDate'].fieldLabel,
			dataIndex: fcJz['endDate'].name,
			renderer : formatDate,
			align : 'center',
			width : 100,
			type : 'date'
		}
	]);
	cmJz.defaultSortable = true;

	var Columns = [
		{name: 'uids', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'finished', type: 'float'},
		{name: 'remindDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'remindRange', type: 'string'},
    	{name: 'conid', type: 'string'},
    	{name: 'conname', type: 'string'},
    	{name: 'sort', type: 'string'},
    	{name: 'partybno', type: 'string'},
    	{name: 'receivedate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'planuser', type: 'string'},
    	{name: 'storageuser', type: 'string'},
		{name: 'jzName', type: 'string'},
		{name: 'sbName', type: 'string'},
    	{name: 'startDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'endDate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];

	dsJz = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : "pid='" + CURRENTAPPID + "' "+conidStr
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsJz.setDefaultSort(orderColumn, 'desc');
	
	var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
		  uids : '',
		  finished : '',
		  remindDate : '',
		  remindRange : '',
		  conname : '',
		  sort : '',
		  partybno : '',
		  receivedate : '',
		  planuser : '',
		  storageuser : '',
		  jzName : '',
		  sbName : '',
		  startDate : '',
		  endDate : ''
	}
	
	var topPanel = new Ext.grid.EditorGridTbarPanel({
		ds : dsJz,
		cm : cmJz,
		sm : smJz,
		title : '设备催交',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><b>'+topPanelName+'</b></font>','-'],
		addBtn : false,
		saveBtn : true,
		delBtn : false,
		saveHandler : saveGoodsUrge,
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsJz,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
        ,listeners: {
			beforeedit:function(e){
	            var currRecord = e.record;
	            if (currRecord.get("finished")=='1')   
	                e.cancel = true;   
	        }
		}
	});
	
	function saveGoodsUrge(){
		var recrods = dsJz.getModifiedRecords();
		if(recrods.length == 0) return;
		var tempArr = new Array();
		for (var i = 0; i < recrods.length; i++) {
			tempArr.push(recrods[i].data);
		}
		DWREngine.setAsync(false);
		equMgm.saveUrge(tempArr,function(str){
			if(str == "1"){
				Ext.example.msg('提示信息','设备催交保存成功！');
				dsJz.reload();
			}else{
				Ext.example.msg('提示信息','保存出错！');
			}
		});
		DWREngine.setAsync(true);
	}
	
	// TODO : ======催交记录明细======
	var smSub = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var fcSub = {
		'uids' : {name : 'uids', fieldLabel : '主键'},
		'pid' : {name : 'pid', fieldLabel : 'PID'},
		'jzDateUids' : {name : 'jzDateUids', fieldLabel : '主表主键'},
		'urgeUser' : {name : 'urgeUser', fieldLabel : '催交人'},
		'urgeDate' : {name : 'urgeDate', fieldLabel : '催交日期', format: 'Y-m-d', readOnly : true},
		'urgeInfo' : {name : 'urgeInfo', fieldLabel : '催交内容'},
		'requireDate' : {name : 'requireDate', fieldLabel : '要求到货日期', format: 'Y-m-d', readOnly : true},
		'remark' : {name : 'remark', fieldLabel : '备注'}
	}

	var cmSub = new Ext.grid.ColumnModel([ // 创建列模型
		// smSub,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcSub['uids'].fieldLabel,
			dataIndex : fcSub['uids'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fcSub['pid'].fieldLabel,
			dataIndex : fcSub['pid'].name,
			hidden : true
		}, {
			id : 'jzDateUids',
			header : fcSub['jzDateUids'].fieldLabel,
			dataIndex : fcSub['jzDateUids'].name,
			hidden : true
		}, {
			id : 'urgeUser',
			header : fcSub['urgeUser'].fieldLabel,
			dataIndex : fcSub['urgeUser'].name,
			editor : new fm.TextField(fcSub['urgeUser']),
			align: 'center',
			width : 100
		}, {
			id : 'urgeDate',
			header : fcSub['urgeDate'].fieldLabel,
			dataIndex : fcSub['urgeDate'].name,
			editor : new fm.DateField(fcSub['urgeDate']),
			align: 'center',
			renderer : formatDate,
			width : 80
		}, {
			id : 'urgeInfo',
			header : fcSub['urgeInfo'].fieldLabel,
			dataIndex : fcSub['urgeInfo'].name,
			editor : new fm.TextField(fcSub['urgeUser']),
			width : 180
		}, {
			id : 'requireDate',
			header : fcSub['requireDate'].fieldLabel,
			dataIndex : fcSub['requireDate'].name,
			editor : new fm.DateField(fcSub['requireDate']),
			align: 'center',
			renderer : formatDate,
			width : 80
		}, {
			id : 'remark',
			header : fcSub['remark'].fieldLabel,
			dataIndex : fcSub['remark'].name,
			editor : new fm.TextField(fcSub['remark']),
			width : 180
		}
	]);
	cmSub.defaultSortable = true;

	var ColumnsSub = [
		{name: 'uids', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'jzDateUids', type: 'string'},
		{name: 'urgeUser', type: 'string'},
		{name: 'urgeDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'urgeInfo', type: 'string'},
    	{name: 'requireDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'remark', type: 'string'}
	];

	var dsSub = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanSub,
			business : businessSub,
			method : listMethodSub,
			params : "1=2"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeySub
		}, ColumnsSub),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsSub.setDefaultSort(orderColumnSub, 'desc');
	
	var PlantSub = Ext.data.Record.create(ColumnsSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		jzDateUids : '',
		urgeUser : '',
		urgeDate : '',
		urgeInfo : '',
		requireDate : '',
		remark : ''
	}
	
	var footPanel = new Ext.grid.EditorGridTbarPanel({
		ds : dsSub,
		cm : cmSub,
		sm : smSub,
		title : '设备催交明细',
		clicksToEdit : 1,
		tbar : ['<font color=#15428b><b>'+topPanelName+'明细</b></font>','-'],
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    region: 'south',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanSub,
		business : businessSub,
		primaryKey : primaryKeySub
	});
	
	var mainPanel = new Ext.Panel({
		border : false,
		layout:'border',
		region : 'center',
		items : [topPanel,footPanel]
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contGridPanel,mainPanel]
	});
	topPanel.getTopToolbar().add({
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: showWindow_
	});
	dsCont.load();
	dsJz.load({params:{start:0,limit:PAGE_SIZE}})
	smJz.on("rowselect",function(){
		var record = smJz.getSelected();
		PlantIntSub.jzDateUids = record.get('uids'); 
		dsSub.baseParams.params = "jzDateUids = '"+record.get('uids')+"'";
		dsSub.reload();
		if(record.get('finished') == 1){
			topPanel.getTopToolbar().setDisabled(true);
			footPanel.getTopToolbar().setDisabled(true);
		}else{
			topPanel.getTopToolbar().setDisabled(false);
			footPanel.getTopToolbar().setDisabled(false);
		}
	})
	smCont.on("rowselect",function(){
		var record = smCont.getSelected();
		dsJz.baseParams.params = "conid = '"+record.get('conid')+"'";
		dsJz.reload();
		dsSub.removeAll();
	})
	function showWindow_(){showWindow(topPanel)};
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

});

function finishUrge(uids,finished){
	Ext.MessageBox.confirm('确认', '完结后不可取消，不可编辑，确认要完结吗？', function(btn,text){
		if(btn == "yes"){
			DWREngine.setAsync(false);
			equMgm.equEquJzDateFinished(uids,function(str){
				if(str == "1"){
					Ext.example.msg('提示信息','设备催交完结操作成功！');
					finished.checked = true;
					dsJz.reload();
				}else{
					Ext.example.msg('提示信息','操作出错！');
					finished.checked = false;
				}
			});
			DWREngine.setAsync(true);
		}else{
			finished.checked = false;
		}
	});
}