var beanEqu = "com.sgepit.pmis.equipment.hbm.EquCont" 
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve"
var beanJz = "com.sgepit.pmis.equipment.hbm.EquJzDate"
var businessJz = "baseMgm"
var listMethodJz = "findWhereOrderby"
var primaryKeyJz = "uids"
var orderColumnJz = "jzNum"
var contractType = new Array();
var contSort = new Array();
var partBs = new Array();

var dsJz;
var smJz;

Ext.onReady(function(){
	
	//合同信息维护 tab
	DWREngine.setAsync(false);
    appMgm.getCodeValue('合同划分类型',function(list){
    	for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contractType.push(temp);			
		}
    });
    
    //获取设备合同
    appMgm.getCodeValue('设备合同',function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort.push(temp);			
		}
    });
    
	//获取乙方单位(供货厂家)
	conpartybMgm.getPartyB(function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
    DWREngine.setAsync(true);
    
    
    var fm = Ext.form;
	var fc = {
    	'uids' : {
    		name: 'uids',
			fieldLabel: '主键'
    	},'conid': {
			name: 'conid',
			fieldLabel: '合同主键'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号',
			readOnly: true,
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称',
			readOnly: true,
			anchor:'95%'
         },'condivno': {
			name: 'condivno',
			fieldLabel: '合同分类',
			readOnly: true,
			anchor:'95%'
         },'sort': {
			name: 'sort',
			fieldLabel: '合同分类二',
			readOnly: true,
			anchor:'95%'
         },'conmoney': {
			name: 'conmoney',
			fieldLabel: '合同总金额',
			readOnly: true,
			anchor: '95%'
         },'partybno':{
         	name:'partybno',
         	fieldLabel : '供货厂家',
         	readOnly: true,
			anchor: '95%'
         },'equnum': {
			name: 'equnum',
			fieldLabel: '设备数量',
			allowBlank: false,
			anchor:'95%'
         },'receivedate': {
			name: 'receivedate',
			fieldLabel: '合同接收日期',
			format: 'Y-m-d',
			value : new Date(),
			anchor:'95%'
         },'planuser': {
			name: 'planuser',
			fieldLabel: '责任计划员',
			allowBlank: false,
			anchor:'95%'
         },'storageuser': {
			name: 'storageuser',
			fieldLabel: '责任库管员',
			allowBlank: false,
			anchor:'95%'
         }
	}
	
	var Columns = [
		{name: 'uids', type: 'string'},
    	{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'conno', type: 'string'},
		{name: 'conname', type: 'string'},
		{name: 'sort', type: 'string'},
    	{name: 'partybno', type: 'string'},
		{name: 'conmoney', type: 'float'},
		{name: 'equnum', type: 'float'},
		{name: 'receivedate', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'planuser', type: 'string'},
		{name: 'storageuser', type: 'string'}
	];
	
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    
    DWREngine.setAsync(false);
    var equCont;
	baseMgm.findById(beanCon, edit_conid,function(obj){
		for(var i=0;i<contSort.length;i++){
			if(obj.sort == contSort[i][0]){
				obj.sort = contSort[i][1];
			}
		}
		for(var i=0;i<partBs.length;i++){
			if(obj.partybno == partBs[i][0]){
				obj.partybno = partBs[i][1];
			}
		}
		equCont = obj;
	});
	baseDao.findByWhere2(beanEqu,"conid='"+edit_conid+"'",function(list){
		if(list.length>0){
			equCont.uids = list[0].uids;
			equCont.equnum = list[0].equnum;
			equCont.receivedate = list[0].receivedate;
			equCont.planuser = list[0].planuser;
			equCont.storageuser = list[0].storageuser;
		}
	});
	loadFormRecord = new formRecord(equCont);
	DWREngine.setAsync(true);
	
	
	var BUTTON_CONFIG = {
    	'CLOSE': {
			text: '关闭',
			iconCls: 'remove',
			handler: function(){
				parent.selectWin.close();
			}
		},'SAVE': {
	        text: '保存',
			iconCls: 'save',
	        handler: formSave
	    }
    };
    
	var formPanel = new Ext.FormPanel({
	    id: 'form-panel',
	    title : '合同信息',
	    header: false,
	    border: false,
	    autoScroll:true,
	    region: 'center',
	    bodyStyle: 'padding:10px 10px;',
		labelAlign: 'left',
		items: [
			new Ext.form.FieldSet({
				title: '设备合同信息维护',
				autoWidth:true,
	            border: true,
	            width:400,
	            layout: 'column',
	            items:[
	            	{
	   					layout: 'form', columnWidth: .5,
	   					bodyStyle: 'border: 0px;',
	   					items:[ 
	   					new fm.Hidden(fc['uids']),
	   					new fm.Hidden(fc['conid']),
	   					new fm.Hidden(fc['pid']),
	   					new fm.Hidden(fc['condivno']),
	   					new fm.TextField(fc['conno']),
	   					new fm.TextField(fc['conname']),
	   					new fm.NumberField(fc['conmoney']),
					   	new fm.TextField(fc['sort']),
	   					new fm.TextField(fc['partybno'])
	   					]  
					},{
						layout: 'form', columnWidth: .5,
						bodyStyle: 'border: 0px;',
						items:[
				            new fm.NumberField(fc['equnum']),
				            new fm.TextField(fc['planuser']),
				            new fm.TextField(fc['storageuser']),
				            new fm.DateField(fc['receivedate'])
						]
					}
				]
			})
		],
		buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['CLOSE']]
	});	    	
	
	// TODO : ======机组交货日期TAB======
	var jzArr = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue("机组", function(list){
    	for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			jzArr.push(temp);
		}
    });
	DWREngine.setAsync(true);
	var jzStore = new Ext.data.SimpleStore({
		fields:['k','v'],
		data : jzArr
	})
	
	var fcJz = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor:'95%'
		},'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			anchor:'95%'
		},'conid' : {
			name : 'conid',
			fieldLabel : '合同主键',
			anchor:'95%'
		},'jzNum' : {
			name : 'jzNum',
			fieldLabel : '序号',
			anchor:'95%'
		},'jzName' : {
			name : 'jzName',
			fieldLabel : '机组名称',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选择违约类型...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: jzStore,
            readOnly : true,
			anchor:'95%'
		},'sbName' : {
			name : 'sbName',
			fieldLabel : '主设备名称',
			anchor:'95%'
		},'startDate' : {
			name : 'startDate',
			fieldLabel : '交货起始日期',
			format: 'Y-m-d',
			readOnly : true,
			anchor:'95%'
		},'endDate' : {
			name : 'endDate',
			fieldLabel : '交货截止日期',
			format: 'Y-m-d',
			readOnly : true,
			anchor:'95%'
		},'remindDate' : {
			name : 'remindDate',
			fieldLabel : '提醒日期',
			format: 'Y-m-d',
			readOnly : true,
			anchor:'95%'
		},'remindRange' : {
			name : 'remindRange',
			fieldLabel : '提醒范围',
			readOnly : true,
			anchor:'95%'
		},'finished' :　{
			name : 'finished',
			fieldLabel : '完结'
		}
	}
	
	smJz = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cmJz = new Ext.grid.ColumnModel([
		//smJz,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id:'uids',
			header: fcJz['uids'].fieldLabel,
			dataIndex: fcJz['uids'].name,
			hidden: true
		},{
			id:'pid',
			header: fcJz['pid'].fieldLabel,
			dataIndex: fcJz['pid'].name,
			hidden: true
		},{
			id:'conid',
			header: fcJz['conid'].fieldLabel,
			dataIndex: fcJz['conid'].name,
			hidden: true
		},{
			id:'jzNum',
			header: fcJz['jzNum'].fieldLabel,
			dataIndex: fcJz['jzNum'].name,
			editor : new fm.NumberField(fcJz['jzNum']),
			hidden: true
		},{
			id:'jzName',
			header: fcJz['jzName'].fieldLabel,
			dataIndex: fcJz['jzName'].name,
			editor : new fm.ComboBox(fcJz['jzName']),
			align : 'center',
			width : 80
		},{
			id:'sbName',
			header: fcJz['sbName'].fieldLabel,
			dataIndex: fcJz['sbName'].name,
			editor : new fm.TextField(fcJz['sbName']),
			width : 220
		},{
			id:'startDate',
			header: fcJz['startDate'].fieldLabel,
			dataIndex: fcJz['startDate'].name,
			renderer : formatDate,
			editor : new fm.DateField(fcJz['startDate']),
			align : 'center',
			width : 90
		},{
			id:'endDate',
			header: fcJz['endDate'].fieldLabel,
			dataIndex: fcJz['endDate'].name,
			renderer :  function(v,m,r){
				var start = r.get('startDate');
				if(start > v && v!=""){
					Ext.example.msg('提示信息','截止日期必须晚于起始日期！');
					return "";
				}else{
					return formatDate(v);
				}
			},
			editor : new fm.DateField(fcJz['endDate']),
			align : 'center',
			width : 90
		},{
			id:'remindDate',
			header: fcJz['remindDate'].fieldLabel,
			dataIndex: fcJz['remindDate'].name,
			renderer : formatDate,
			editor : new fm.DateField(fcJz['remindDate']),
			align : 'center',
			width : 90
		},{
			id:'remindRange',
			header: fcJz['remindRange'].fieldLabel,
			dataIndex: fcJz['remindRange'].name,
			renderer : function(v,m,r){
				//if(r.get("finished") != "1")
				//	m.attr = "style=background-color:#FBF8BF";
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
				onTriggerClick: function(e){
					var uids = smJz.getSelected().get('uids');
					if(uids == null || uids == ""){
						Ext.example.msg('提示信息','请先保存后再设置提醒范围！');
						return;
					}
					remindRangeWin.show();
				}
			}),
			align : 'center',
			width : 100
		},{
			id : 'finished',
			header: fcJz['finished'].fieldLabel,
			dataIndex: fcJz['finished'].name,
			hidden: true
		}
	]);
	cmJz.defaultSortable = true;
	
	var ColumnsJz = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'conid', type: 'string'},
		{name: 'jzNum', type: 'float'},
		{name: 'jzName', type: 'string'},
		{name: 'sbName', type: 'string'},
    	{name: 'startDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'endDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'remindDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'remindRange', type: 'string'},
		{name: 'finished', type: 'float'}
	];
	var PlantJz = Ext.data.Record.create(ColumnsJz);
    var PlantIntJz = {
		uids : '',
		conid : edit_conid,
    	pid : CURRENTAPPID,
		jzNum : '',
		jzName : '',
		sbName : '',
    	startDate : '',
    	endDate : '',
    	remindDate : '',
    	remindRange : '未设置',
    	finished : 0
	}	
  
    dsJz = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanJz,				
	    	business: businessJz,
	    	method: listMethodJz,
	    	params: "conid='"+edit_conid+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyJz
        }, ColumnsJz),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsJz.setDefaultSort(orderColumnJz, 'asc');
	
	var gridPanelJz = new Ext.grid.EditorGridTbarPanel({
		ds : dsJz,
		cm : cmJz,
		sm : smJz,
		title : '机组交货日期',
		region: 'center',
		border : false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>机组交货日期信息<B></font>','-'],
		stripeRows: true,
		loadMask : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsJz,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : PlantJz,
		plantInt : PlantIntJz,
		servletUrl : MAIN_SERVLET,
		bean : beanJz,
		business : businessJz,
		primaryKey : primaryKeyJz
		,listeners : {
			beforeedit:function(e){
	            var currRecord = e.record;
	            if (currRecord.get("finished")=='1' || jz_view == "1")   
	                e.cancel = true;
	        }
		}
	})
	
    var contentPanel = new Ext.TabPanel({
    	//activeTab: jz_view == 0 ? 0 :1 ,
        activeTab : 0,
        border: false,
        region: 'center',
    	items: [formPanel,gridPanelJz]
    });
    
    // 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
            layout: 'border',
            autoWidth:true,
            items: [
            		jz_view == 1 ? gridPanelJz : contentPanel
				]
    });
    
    formPanel.getForm().loadRecord(loadFormRecord);
    dsJz.load({params:{start:0,limit:PAGE_SIZE}});
    
    if(jz_view == 1){
    	gridPanelJz.getTopToolbar().setDisabled(true);
    }
    smJz.on("rowselect",function(){
    	var f = smJz.getSelected().get("finished");
    	if(f=="1"){
    		gridPanelJz.getTopToolbar().setDisabled(true);
    	}else{
			if(jz_view == 1){
		    	gridPanelJz.getTopToolbar().setDisabled(true);
		    }else{
    			gridPanelJz.getTopToolbar().setDisabled(false);
		    }
    	}
    });
     
    
    function formSave(){
    	var form = formPanel.getForm();
    	var equnum = form.findField('equnum');
    	var planuser = form.findField('planuser');
    	var storageuser = form.findField('storageuser');
    	if(equnum.getValue() == null || equnum.getValue() == ""){
			Ext.example.msg('提示信息','设备数量不能为空！');
			equnum.onBlur();
			equnum.focus();
			return;
    	}
    	if(planuser.getValue() == null || planuser.getValue() == ""){
			Ext.example.msg('提示信息','责任计划员不能为空！');
			planuser.onBlur();
			planuser.focus();
			return;
    	}
    	if(storageuser.getValue() == null || storageuser.getValue() == ""){
			Ext.example.msg('提示信息','责任库管员不能为空！');
			storageuser.onBlur();
			storageuser.focus();
			return;
    	}
    	var obj = form.getValues();
		for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	equMgm.addOrUpdateEquCont(obj,function(str){
    		if(str == "1"){
    			Ext.example.msg('提示信息','合同信息保存成功！');
    		}else{
    			Ext.example.msg('提示信息','合同信息保存失败！');
    		}
    	});
    	DWREngine.setAsync(true);
    }
    
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

})