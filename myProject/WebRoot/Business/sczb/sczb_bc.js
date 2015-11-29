var beanPB = "com.sgepit.pmis.sczb.hbm.SczbBc";
var businessPB = "baseMgm"
var listMethodPB = "findWhereOrderby"
var primaryKeyPB = "UIDS"
var orderColumnPB = "xh"
var partbDet;
var partbWindow;
var queryWin;
var currentPid = CURRENTAPPID;
Ext.onReady(function(){
//是否禁用添加/修改/删除按钮
var btnDisabled = ModuleLVL != '1';
	
	DWREngine.setAsync(false);
	systemMgm.getUnitById(CURRENTAPPID, function(u) {
		if(u && u!=null && u!='null') {
			currentPid = u.upunit;
		}
	});
	DWREngine.setAsync(true);

	var gridfilter = "PID = '" + currentPid + "'";
	//var gridfilter = "type = '1'";
	var letters = new Array();
	letters.push(['','所有单位'])
	for(var i=65;i<91;i++){
	    var temp = new Array();
	    temp[0] = String.fromCharCode(i);
	    temp[1] = String.fromCharCode(i);
	    letters.push(temp);
	}
	
	
	var btnSelect = new Ext.Button({
		id: 'select',
		text: '选择',
		tooltip: '选择乙方单位',
		iconCls: 'btn'
	});

	//按字母A-Z查询
	selectByFirstWord = new Ext.form.ComboBox({
    	id:'letter',
		readOnly : true,
		width:125,
		maxHeight:200,
		valueField:'id',
		displayField: 'name',
        store: new Ext.data.SimpleStore({
        	fields: ['id', 'name'],
        	data: letters}),
        mode: 'local',
        triggerAction: 'all',
        emptyText:"按编号首字母查询",
        listeners:{'select':queryByLetter}
    }); 
    var btnQuery= new Ext.Button({
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'option',
		handler: queryWindow
	});
   
    function queryByLetter(){
    	var letter = Ext.getCmp('letter').getValue();
    	dsPB.baseParams.params = gridfilter + "and PARTYBNO LIKE '"+letter+"%'";
		dsPB.load({params:{start: 0,limit: PAGE_SIZE}});
    }


	var fm = Ext.form;	
    var fcPB = { 'xh': {
			name: 'xh',
			fieldLabel: '序号',
			anchor:'95%'
         }, 'UIDS': {
			name: 'UIDS',
			fieldLabel: 'UIDS',
			//hidden:true,
			//hideLabel:true,
			anchor:'95%'
         }, 'bcName': {
			name: 'bcName',
			fieldLabel: '班次',
			//hideLabel:true,
			//hidden:true,
			anchor:'95%'
         }, 'beginTime': {
			name: 'beginTime',
			fieldLabel: '开始时间',
			allowBlank: false,
			anchor:'95%'
         }, 'longTime': {
			name: 'longTime',
			fieldLabel: '时长',
			allowBlank: false,
			anchor:'95%'
         }, 'PID': {
			name: 'PID',
			fieldLabel: '项目',
			anchor:'95%'
         },'isUsed': {
			name: 'isUsed',
			fieldLabel: '是否可用',
			anchor:'95%'
         }
    }
    var smPB = new Ext.grid.CheckboxSelectionModel({singleSelect:false})
    var cmPB = new Ext.grid.ColumnModel([		// 创建列模型
    	smPB,{
           id:'xh',   
           header: fcPB['xh'].fieldLabel,
           dataIndex: fcPB['xh'].name,
           width: 100,
           editor: new fm.TextField(fcPB['xh']),
           renderer :  function(data) {
                var qtip = "qtip=" + data;
                return '<span ' + qtip + '>' + data + '</span>';
                    return data;
                }
        
        },{
           id:'UIDS',                  
           header: fcPB['UIDS'].fieldLabel,
           dataIndex: fcPB['UIDS'].name,
           hidden: true
        },{ 
           id:'bcName',  
           header: fcPB['bcName'].fieldLabel,
           dataIndex: fcPB['bcName'].name,
           editor: new fm.TextField(fcPB['bcName']),
           hidden: false
        },{
           id:'beginTime',  
           header: fcPB['beginTime'].fieldLabel,
           dataIndex: fcPB['beginTime'].name,
           width: 65,
           renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'), // Ext内置日期renderer
           editor: new Ext.form.DateField({//调用日期时间选择组件
					name: 'beginTime',
					format:'Y-m-d H:i',
					menu:new DatetimeMenu()
				})
        
        },{
           id: 'longTime',                       
           header: fcPB['longTime'].fieldLabel,
           dataIndex: fcPB['longTime'].name,
           width: 120,
           editor: new fm.TextField(fcPB['longTime']),
           renderer :  function(data) {
                var qtip = "qtip=" + data;
                return '<span ' + qtip + '>' + data + '</span>';
                    return data;
                }
        },{
           id: 'PID',                  
           header: fcPB['PID'].fieldLabel,
           dataIndex: fcPB['PID'].name,
           width: 150,
           editor: new fm.TextField(fcPB['PID']),
           hidden: true
        },{
           id: 'isUsed',                  
           header: fcPB['isUsed'].fieldLabel,
           dataIndex: fcPB['isUsed'].name,
           width: 150,
           //editor: new fm.TextField(fcPB['isUsed']),
           
           editor: new Ext.form.ComboBox({
			mode : 'local',
			width:80,
			store : new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [[0, '可用'], [1, '禁用']]
			}),
			triggerAction : 'all',
			valueField : 'k',
			displayField : 'v',
			editable : false,
			//fieldLabel:fcPB['isUsed'].fieldLabel,
			name : fcPB['isUsed'],
			value : 0
	}),
           hidden: false,
           renderer :  function(data) {
               		if(data=='0'){
               			return "可用";
               		}else{
               			return "禁用";
               		}
                }
        }
    ]);
    cmPB.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var ColumnsPB = [
    	{name: 'UIDS', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'bcName', type: 'string'},
		{name: 'beginTime', type: 'date', dateFormat : 'Y-m-d H:i:s'},    	
		{name: 'longTime', type: 'float'},
		{name: 'xh', type: 'int'},
		{name: 'PID', type: 'string'},
		{name: 'isUsed', type: 'string'}]
       
	var FieldsPB = ColumnsPB.concat([							//表单增加的列
		{name: 'UIDS', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'bcName', type: 'string'},
		{name: 'beginTime', type: 'date'},    	
		{name: 'longTime', type: 'double'},
		{name: 'xh', type: 'int'},
		{name: 'PID', type: 'string'},
		{name: 'isUsed', type: 'string'}
	])
    var PlantPB = Ext.data.Record.create(ColumnsPB);			//定义记录集
    var PlantFieldsPB = Ext.data.Record.create(FieldsPB);		
    var PlantIntPB = {UIDS: '', PID: currentPid, bcName: '', beginTime: '',longTime: '', xh: '',isUsed:'0'}	//设置初始值
    var PlantFieldsIntPB = new Object();
    Ext.applyIf(PlantFieldsIntPB, PlantIntPB)
    PlantFieldsIntPB = Ext.apply(PlantFieldsIntPB, {UIDS:'',bcName:'',beginTime:'', longTime:'',xh:'',PID:'',isUsed:'0'});		

    // 4. 创建数据源
    var dsPB = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				
	    	bean: beanPB,				
	    	business: businessPB,
	    	method: listMethodPB,
	    	params: gridfilter
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'UIDS'
        }, ColumnsPB),

        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsPB.setDefaultSort(orderColumnPB, 'asc');	
    
    var gridPB = new Ext.grid.EditorGridTbarPanel({
        // basic properties
    	id: 'grid-panrel',			//id,可选
        ds: dsPB,					//数据源
        cm: cmPB,					//列模型
        sm: smPB,					//行选择模式
        tbar: [],		//顶部工具栏，可选
        height: 300,				//高
//        iconCls: 'icon-show-all',	//面板样式
        border: false,
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows:true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsPB,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantPB,				//初始化记录集，必须
      	plantInt: PlantIntPB,		//初始化记录集配置，必须
      	servletUrl: MAIN_SERVLET,	//服务器地址，必须
      	bean: beanPB,					//bean名称，必须
      	business:businessPB,	//business名称，可选
      	primaryKey: primaryKeyPB,			//主键列名称，必须
//      	formBtn:true,
      	saveBtn : true,
//      	formHandler: popPartbDet,
		saveHandler: partybSaveHandler,
//		insertHandler : insertPartBHandler,
		listeners : {
		    afterdelete : function (grid,ids,primaryKey,bean){
//		               conpartybMgm.immediatelySendPartybDel(ids,bean,function (rtn){
//		               })
			
			
		    }
		}
	});
    dsPB.load({params:{
	    	 start: 0,
	    	 limit:  PAGE_SIZE
    	 }
    });
    
    var canUseCombo = new Ext.form.ComboBox({
			mode : 'local',
			width:80,
			store : new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [[0, '可用'], [1, '禁用']]
			}),
			triggerAction : 'all',
			valueField : 'k',
			displayField : 'v',
			editable : false,
			fieldLabel:fcPB['isUsed'].fieldLabel,
			name : fcPB['isUsed'].name,
			value : 0
	});
    
    
    // 6. 创建表单form-panel
    var formPanelPB = new Ext.FormPanel({
        id:'partB-panel',
        header:false,
        border: false,
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'right',
	    autoScroll:true,
    	items: [{
    			layout:'column',
	            bodyStyle: 'padding:8px',
	            border:false,
	            items:[{
	                columnWidth:.5,
	                layout: 'form',
	                border:false,
	                items: [ new fm.Hidden(fcPB['UIDS']),
	                		 new fm.TextField(fcPB['bcName']),
	                		 new Ext.form.DateField({//调用日期时间选择组件
								name: fcPB['beginTime'].name,
								fieldLabel : fcPB['beginTime'].fieldLabel,
								format:'Y-m-d H:i',
								menu:new DatetimeMenu()
							}),
	                	 	 //new fm.TextField(fcPB['beginTime']),
	                	 	 new fm.TextField(fcPB['longTime']),
	                	 	 new fm.TextField(fcPB['xh']),
	                	 	 new fm.TextField({
	                	 		width:130, 
	                	 		fieldLabel:fcPB['PID'].fieldLabel,
								value:CURRENTAPPNAME
	                	 	 }),
	                	 	 canUseCombo
	                	]
	            }]
	        }],
		buttons: [{
			id: 'save',
            text: '保存',
			disabled : btnDisabled,
            handler: formSavePB
        },{
			id: 'cancel',
            text: '取消',
            handler: formCancelPB
        }]
    });
    // 13. 其他自定义函数，如格式化，校验等
    function partybSaveHandler(){
    	var records = dsPB.getModifiedRecords();
    	if (records && records.length > 0){
    		
    		for(var i=0;i<records.length;i++){
    			var record=records[i];
    			var flag = true;
    			var xh = records[i].get('xh');
    			var bcName = records[i].get('bcName');
    			var beginTime = records[i].get('beginTime');
    			var longTime = records[i].get('longTime');
    			if ("" == xh){
	    			Ext.example.msg('提示', '必填项：序号 未填写！');
	    			return;
	    		}else if ("" == bcName){
	    			Ext.example.msg('提示', '必填项：班次 未填写！');
	    			return;
	    		}else if ("" == beginTime){
	    			Ext.example.msg('提示', '必填项：开始时间 未填写！');
	    			return;
	    		}else if ("" == longTime){
	    			Ext.example.msg('提示', '必填项：时长 未填写！');
	    			return;
	    		}
	    		DWREngine.setAsync(false);
    			sczbBcMgm.exists(record.data, function(state){
		    		if (state == true){
		    			Ext.MessageBox.show({
	    					title: '警告',
	    					msg: '班次有重复！<br>请重新输入...',
	    					buttons: Ext.MessageBox.OK,
	    					icon: Ext.MessageBox.WARNING
	    				});
	    				flag = false;
		    		} 
		    	});
		    	DWREngine.setAsync(true);
    	}
    		 
    		if (flag){
//            DWREngine.setAsync(false);
            gridPB.defaultSaveHandler();
//            Ext.example.msg('保存成功！', '您成功修改了一条信息！');
//            DWREngine.setAsync(true);
    		//dsPB.reload();
    		}
            //dsPB.load({params:{start : 0 ,limit : PAGE_SIZE}});	
            //alert("@@@@");
    	}
    	
    };
    function loadFormPB(){
    	var form = formPanelPB.getForm()
    	if (smPB.getSelected()!=null)
    	{
    		var gridRecod = smPB.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsIntPB);
    				for(var i=0; i<ColumnsPB.length; i++){
    					if (typeof(temp[ColumnsPB[i].name])!="undefined"){
    						temp[ColumnsPB[i].name] = gridRecod.get(ColumnsPB[i].name)
    					}
    				}
    				form.loadRecord(new PlantFieldsPB(temp))
    			}
    			formPanelPB.isNew = true
//    			else
//    				form.loadRecord(new PlantFieldsPB(PlantFieldsIntPB))
//			    	if (ModuleLVL < 3) {
//			    		formPanel.buttons[0].enable()
//			    	}
//	    			formPanelPB.isNew = true
    		}
    		else
    		{
	    		var ids = smPB.getSelected().get('UIDS');
	    		baseMgm.findById( "com.sgepit.pmis.sczb.hbm.SczbBc",ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
		    				partbDet.hide();
		    				return;
			    		}
			    		var obj = new Object();
			    		for(var i=0; i<FieldsPB.length; i++){
			    			var n = FieldsPB[i].name
			    			obj[n] = rtn[n]
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<ColumnsPB.length; i++){
		    					if (typeof(obj[ColumnsPB[i].name])!="undefined"){
		    						obj[ColumnsPB[i].name] = gridRecod.get(ColumnsPB[i].name)
		    					}
		    				}
					    }	
			    		var record = new PlantFieldsPB(obj)
			    		form.loadRecord(record)
			    		formPanelPB.buttons[0].enable()
			    		formPanelPB.isNew = false
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFieldsPB(PlantFieldsIntPB))
    	}    
    }
    
    
    function formSavePB(){
    	var form = formPanelPB.getForm()
    	var bcName = form.findField('bcName').getValue();
    	//var PID = form.findField('PID').getValue();
    	var flag = true;
    	DWREngine.setAsync(false);
		sczbBcMgm.exists(bcName, currentPid, function(state){
			if (state == true){
    			Ext.MessageBox.show({
					title: '警告',
					msg: '班次名称 有重复！<br>请重新输入...',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.WARNING
				});
				flag = false;
    		}
    	});
    	DWREngine.setAsync(true);
    	if (flag == false) return;
    	if (form.isValid()){
	    		doFormSavePB()
	    }
    }
    
    function doFormSavePB(){
        var basicForm = formPanelPB.getForm();
        var bcName = basicForm.findField('bcName').getValue();
        var beginTime = basicForm.findField('beginTime').getValue();
        var longTime = basicForm.findField('longTime').getValue();
        var xh = basicForm.findField('xh').getValue();
        var isUsed = basicForm.findField('isUsed').getValue();
        var obj = new Object();
            obj.bcName = bcName;
            obj.beginTime = beginTime;
            obj.longTime = longTime;
            obj.xh = xh;
            obj.PID = currentPid;
            obj.isUsed= isUsed;
            DWREngine.setAsync(false);
            sczbBcMgm.insertSczbBc(obj,function(rtn){
            })
            DWREngine.setAsync(true);
            dsPB.load({params:{start : 0 ,limit : PAGE_SIZE}});
		    partbDet.hide();
    }
    
    function formCancelPB(){
    	partbDet.hide();
    	partbDet = null
    }
    
   	function popPartbDet(){
   		if(!partbDet){
	         partbDet = new Ext.Window({	                  
	             title:'班次设定详情',
	             layout:'fit',
	             width:700,
	             height:325,
	             modal : true,
	             closeAction:'hide',
	             plain: true,	                
	             items: formPanelPB
             });
    	}
    	partbDet.show();
    	loadFormPB();
   	}
   	
   	smPB.on('selectionchange', function(smPB){ // grid 行选择事件
   		var record = smPB.getSelected();
		var tb = gridPB.getTopToolbar();
   		if (record!=null) {
   			tb.items.get("form").enable();
    	}else{
   			tb.items.get("form").disable();
    	}
//    	if (partbWindow!=null && !partbWindow.hidden){
//    		loadFormPB();
//    	}
    });
    
   	
	
var queryForm = new Ext.FormPanel({
    header: false, border: false, autoScroll: true,
    bodyStyle: 'padding:10px 10px;', iconCls: 'icon-detail-form', labelAlign: 'left',
    items: [{
    	xtype: 'fieldset',
		title: '字段查询',
      	border: true,
      	layout: 'table',
      	layoutConfig: {columns: 1},
      	defaults: {bodyStyle:'padding:1px 1px'},
      	items: [{
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'partybno',
				fieldLabel: '乙方编号',
				width: 183
			}]
		},{
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'partyb',
				fieldLabel: '乙方单位',
				width: 183
			}]
		},{
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'partyblawer',
				fieldLabel: '法人代表人',
				width: 183
			}]
		},{
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'partybbank',
				fieldLabel: '开户行',
				width: 183
			}]
		},{
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'partybbankno',
				fieldLabel: '开户行账号',
				width: 183
			}]
		}]
	}],
	bbar: ['->',{
		id: 'query',
		text: '查询',
		tooltip: '查询',
		iconCls: 'btn',
		handler: execQuery
	}]
});

function queryWindow(){
	if(!queryWin){
		queryWin = new Ext.Window({	               
			title: '查询数据',
			width: 460, minWidth: 460, height: 280,
			layout: 'fit', iconCls: 'form', closeAction: 'hide',
			border: false, constrain: true, maximizable: false, modal: true,
			items: [queryForm]
		});   
 	}
 	queryForm.getForm().reset();
 	queryWin.show();
}

function execQuery(){
	var form = queryForm.getForm(), queStr = gridfilter;
	if (form.isValid()){
		var partybno = form.findField('partybno');
		if ('' != partybno.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'partybno like \'%' + partybno.getValue() + '%\'';
		}
		
		var partyb = form.findField('partyb');
		if ('' != partyb.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'partyb like \'%' + partyb.getValue() + '%\'';
		}
		
		var partyblawer = form.findField('partyblawer');
		if ('' != partyblawer.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'partyblawer like \'%' + partyblawer.getValue() + '%\'';
		}
		
		var partybbank = form.findField('partybbank');
		if ('' != partybbank.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'partybbank like \'%' + partybbank.getValue() + '%\'';
		}
		
		var partybbankno = form.findField('partybbankno');
		if ('' != partybbankno.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'partybbankno like \'%' + partybbankno.getValue() + '%\'';
		}
		
		dsPB.baseParams.params = queStr;
		dsPB.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
		queryWin.hide();
	}
}

function getNewPartyBNo(){
	var newPartybno = "";
	DWREngine.setAsync(false)
	conpartybMgm.getPartyBNo(function(str){
		newPartybno = str;
	})
	DWREngine.setAsync(true);	
	return newPartybno;
}
    var viewport = new Ext.Viewport({
          layout:'fit',
          items: [gridPB]
    });
	//gridPB.getTopToolbar().add('-');
   //	gridPB.getTopToolbar().add('按首字母查询：');
   //	gridPB.getTopToolbar().add(selectByFirstWord);
   // gridPB.getTopToolbar().add('-');  
   //	gridPB.getTopToolbar().add(btnQuery); 
   	function insertPartBHandler(){
   	    if(!partbDet){
	         partbDet = new Ext.Window({	                  
	             title:'班次详情',
	             layout:'fit',
	             width:550,
	             height:300,
	             modal : true,
	             closeAction:'hide',
	             plain: true,	                
	             items: formPanelPB
             });
    	}
		formPanelPB.getForm().reset();
    	partbDet.show();
   	}   
})    
   