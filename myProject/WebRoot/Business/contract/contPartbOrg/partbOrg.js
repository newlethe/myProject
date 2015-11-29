
var beanPB = "com.sgepit.pmis.contract.hbm.ConPartyb";
var businessPB = "baseMgm"
var listMethodPB = "findWhereOrderby"
var primaryKeyPB = "cpid"
var orderColumnPB = "partybno"
var smPB = new Ext.grid.CheckboxSelectionModel({singleSelect:true})
var partbDet;
var partbWindow;
var queryWin;
var currentPid = CURRENTAPPID;

	DWREngine.setAsync(false);
	systemMgm.getUnitById(CURRENTAPPID, function(u) {
		if(u && u!=null && u!='null') {
			currentPid = u.upunit;
		}
	});
	DWREngine.setAsync(true);
	
	//PID查询条件
	var pidWhereString = "pid = '"+currentPid+"'"

	var btnSelect = new Ext.Button({
		id: 'select',
		text: '选择',
		tooltip: '选择乙方单位',
		iconCls: 'btn',
		handler:function(){
			if(gridPB.getSelectionModel().getSelected()){
				var r=gridPB.getSelectionModel().getSelected();
				var temp = new Array();
				temp.push(r.get("cpid"));			
				temp.push(r.get("partyb"));		
				partBField.setValue(r.get("cpid"));
				partBField.setRawValue(r.get("partyb"));
				partbWindow.hide();
			}else{
				Ext.MessageBox.alert('提示',"请选择一条记录")
			}
		}
	});

	var fm = Ext.form;	
    var fcPB = {		
    	 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'cpid': {
			name: 'cpid',
			fieldLabel: '流水号主键',
			hideLabel:true,
			hidden:true,
			anchor:'95%'
         }, 'partybno': {
			name: 'partybno',
			fieldLabel: '乙方单位编号',
			allowBlank: false,
			anchor:'95%'
         }, 'partyb': {
			name: 'partyb',
			fieldLabel: '乙方单位名称',
			allowBlank: false,
			anchor:'95%'
         }, 'partybshort': {
			name: 'partybshort',
			fieldLabel: '手机',
			anchor:'95%'
         }, 'partyblawer': {
			name: 'partyblawer',
			fieldLabel: '法人代表人',
			anchor:'95%'
         }, 'partybbank': {
			name: 'partybbank',
			fieldLabel: '开户行',
			anchor:'95%'
         }, 'partybbankno': {
			name: 'partybbankno',
			fieldLabel: '开户行帐号',
			anchor:'95%'
         }, 'address': {
			name: 'address',
			fieldLabel: '地址',
			anchor:'95%'
         }, 'postalcode': {
			name: 'postalcode',
			fieldLabel: '邮编',
			anchor:'95%'
         }, 'phoneno': {
			name: 'phoneno',
			fieldLabel: '电话',
			anchor:'95%'
         }, 'email': {
			name: 'email',
			fieldLabel: '电子邮件',
			anchor:'95%'
         }, 'fax': {
			name: 'fax',
			fieldLabel: '传真',
			anchor:'95%'
         }, 'homepage': {
			name: 'homepage',
			fieldLabel: '主页',
			anchor:'95%'
         }, 'linkman': {
			name: 'linkman',
			fieldLabel: '联系人',
			anchor:'95%'
         }, 'brief': {
			name: 'brief',
			fieldLabel: '简介',
			hideLabel: true,
			width: 400,
			height: 120,
			xtype: 'htmleditor',
			anchor:'95%'
         }
    }

    var cmPB = new Ext.grid.ColumnModel([		// 创建列模型
    	smPB,{
           id:'cpid',
           header: fcPB['cpid'].fieldLabel,
           dataIndex: fcPB['cpid'].name,
           hidden: true
        },{
           id:'pid',
           header: fcPB['pid'].fieldLabel,
           dataIndex: fcPB['pid'].name,
           hidden: true
        },{
           id:'partybno',
           header: fcPB['partybno'].fieldLabel,
           dataIndex: fcPB['partybno'].name,
           width: 65,
           editor: new fm.TextField(fcPB['partybno'])
        },{
           id: 'partyb',
           header: fcPB['partyb'].fieldLabel,
           dataIndex: fcPB['partyb'].name,
           width: 120,
           editor: new fm.TextField(fcPB['partyb'])
        },{
           id: 'partyblawer',
           header: fcPB['partyblawer'].fieldLabel,
           dataIndex: fcPB['partyblawer'].name,
           width: 70,
           editor: new fm.TextField(fcPB['partyblawer'])
        },{
           id: 'partybbank',
           header: fcPB['partybbank'].fieldLabel,
           dataIndex: fcPB['partybbank'].name,
           width: 150,
           editor: new fm.TextField(fcPB['partybbank'])
        },{
           id: 'partybbankno',
           header: fcPB['partybbankno'].fieldLabel,
           dataIndex: fcPB['partybbankno'].name,
           width: 90,
           editor: new fm.TextField(fcPB['partybbankno'])
        }
    ]);
    cmPB.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var ColumnsPB = [
    	{name: 'cpid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'partybno', type: 'string'},    	
		{name: 'partyb', type: 'string'},
		{name: 'partyblawer', type: 'string'},
		{name: 'partybbank', type: 'string'},
		{name: 'partybbankno', type: 'string'}]
	var FieldsPB = ColumnsPB.concat([							//表单增加的列
		{name: 'address', type: 'string'},
		{name: 'partybshort', type: 'string'},
		{name: 'postalcode', type: 'string'},
		{name: 'phoneno', type: 'string'},
		{name: 'email', type: 'string'},
		{name: 'homepage', type: 'string'},
		{name: 'fax', type: 'string'},
		{name: 'linkman', type: 'string'},
		{name: 'brief', type: 'string'}
	])
    var PlantPB = Ext.data.Record.create(ColumnsPB);			//定义记录集
    var PlantFieldsPB = Ext.data.Record.create(FieldsPB);		
    var PlantIntPB = {cpid: '', pid: currentPid, partybno: '', partyb: '',partyblawer: '', partybbank: '', partybbankno: ''}	//设置初始值
    var PlantFieldsIntPB = new Object();
    Ext.applyIf(PlantFieldsIntPB, PlantIntPB)
    PlantFieldsIntPB = Ext.apply(PlantFieldsIntPB, {address:'',postalcode:'',phoneno:'', email:'',homepage:'',brief:'',fax:'', linkman:'', partybshort:''});		

    // 4. 创建数据源
    var dsPB = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				
	    	bean: beanPB,				
	    	business: businessPB,
	    	method: listMethodPB,
	    	params: pidWhereString
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'cpid'
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
        tbar: [btnSelect, '-', {text: '查询', iconCls: 'option', handler: queryWindow}, '-'],		//顶部工具栏，可选
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
      	formBtn:true,
      	formHandler: popPartbDet,
		saveHandler: partybHandler,
		listeners : {
		    aftersave : function (grid,idsOfInsert,idsOfUpdate,primaryKey,bean){
		               conpartybMgm.immediatelySendPartybSave(idsOfInsert,idsOfUpdate,bean,function(rtn){
		               });
		    },
		    afterdelete : function (grid,ids,primaryKey,bean){
		               conpartybMgm.immediatelySendPartybDel(ids,bean,function (rtn){
		               })
		    }
		}
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
	                items: [ new fm.TextField(fcPB['partybno'])]
	            },{
	                columnWidth:.5,
	                layout: 'form',
	                border:false,
	                items: [ new fm.TextField(fcPB['partyb'])]
	            },{
	                columnWidth:.0,
	                layout: 'form',
	                border:false,
	                items: [ new fm.TextField(fcPB['cpid']),
	                		 new fm.TextField(fcPB['pid'])
	                	    ]
	            }]
	        },{   
	        	xtype:'tabpanel',   
	        	deferredRender:false,         		                     
	            activeTab: 0,
	            defaults:{autoHeight:true, bodyStyle:'padding:10px'},        
                border:false,                              
                items: [{
                    title:'乙方单位传真',
	                layout: 'column',
	                border:false,
	                columnWidth:.5,
	                items:[{
	                	layout: 'form',
		                border:false,
		                columnWidth:.5,
		                items:[  	         			            	
			            	new fm.TextField(fcPB['partyblawer']),
			            	new fm.TextField(fcPB['linkman']),
			            	new fm.TextField(fcPB['partybshort']),
			            	new fm.TextField(fcPB['partybbank']),
			            	new fm.TextField(fcPB['partybbankno'])
			               ]
			        },{
			        layout: 'form',
	                border:false,
	                columnWidth:.5,
	                items:[	
			            	new fm.TextField(fcPB['postalcode']),
			            	new fm.TextField(fcPB['phoneno']),
			            	new fm.TextField(fcPB['fax']),
//			            	new fm.TextField(fcPB['homepage']),
			            	new fm.TextField(fcPB['address']),
			            	new fm.TextField(fcPB['email'])	 
						   ]
					  }]	   
				   },{
				    layout: 'fit',
	                border: false, 
	                bodyStyle: 'padding 0px 0px;',
	                title: '单位简介',
	                cls: 'x-plain',              
	                items: [fcPB['brief']
						   ]
				   }]
				 }],
		buttons: [{
			id: 'save',
            text: '保存',
            disabled: false,
            handler: formSavePB
        },{
			id: 'cancel',
            text: '取消',
            handler: formCancelPB
        }]
    });
    
    // 13. 其他自定义函数，如格式化，校验等
    function partybHandler(){
    	var records = dsPB.getModifiedRecords();
    	if (records && records.length > 0){
    		var flag = true;
    		for (var i=0; i<records.length; i++){
    			var f_partybno = records[i].get('partybno');
    			var f_partyb = records[i].get('partyb');
    			var f_cpid = records[i].get('cpid');
    			if ("" == f_partybno){
	    			Ext.example.msg('提示', '必填项：乙方单位编号 未填写！');
	    			return;
	    		}else if ("" == f_partyb){
	    			Ext.example.msg('提示', '必填项：乙方单位名称 未填写！');
	    			return;
	    		}
	    		DWREngine.setAsync(false);
    			conpartybMgm.checkPartyb(f_partybno, f_partyb, f_cpid, function(state){
		    		if (state == false){
		    			Ext.MessageBox.show({
	    					title: '警告',
	    					msg: '乙方单位编号 或 乙方单位名称 有重复！<br>请重新输入...',
	    					buttons: Ext.MessageBox.OK,
	    					icon: Ext.MessageBox.WARNING
	    				});
	    				flag = false;
		    		}
		    	});
		    	DWREngine.setAsync(true);
    		}
    		if (flag) gridPB.defaultSaveHandler();
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
//    			else
//    				form.loadRecord(new PlantFieldsPB(PlantFieldsIntPB))
//			    	if (ModuleLVL < 3) {
//			    		formPanel.buttons[0].enable()
//			    	}
//	    			formPanelPB.isNew = true
    		}
    		else
    		{
	    		var ids = smPB.getSelected().get('cpid')
	    		baseMgm.findById( "com.sgepit.pmis.contract.hbm.ConPartyb",ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
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
    	var ids = form.findField('cpid').getValue();
    	var f_partybno = form.findField('partybno').getValue();
    	var f_partyb = form.findField('partyb').getValue();
    	var f_cpid = form.findField('cpid').getValue();
    	var flag = true;
    	DWREngine.setAsync(false);
		conpartybMgm.checkPartyb(f_partybno, f_partyb, f_cpid, function(state){
    		if (state == false){
    			Ext.MessageBox.show({
					title: '警告',
					msg: '乙方单位编号 或 乙方单位名称 有重复！<br>请重新输入...',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.WARNING
				});
				flag = false;
    		}
    	});
    	DWREngine.setAsync(true);
    	if (flag == false) return;
    	if (form.isValid()){
	    	if (formPanelPB.isNew) {
	    		doFormSavePB(true)
	    	} else {
	    		doFormSavePB(false)
	    	}
	    }
    }
    
    function doFormSavePB(isNew, dataArr){
    	var form = formPanelPB.getForm()
    	var obj = form.getValues()
    	
    	var dataArr = '[' + Ext.encode(obj) + ']';
   		var r = smPB.getSelected()
   		form.updateRecord(r);
		if (isNew)
		{
			gridPB.doSave(dataArr, 1, 1, function(flag, n){
				r.isNew = !flag
				formPanelPB.isNew = !flag
			});
   		}
   		else
   		{
			gridPB.doSave(dataArr, 1, 0);
		}
		partbDet.hide();
    }
    
    function formCancelPB(){
    	partbDet.hide();
    	partbDet = null
    }
    
   	function popPartbDet(){
   		var records = dsPB.getModifiedRecords();
   		if(records.length>0){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先保存修改了的信息！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}
   		if(!partbDet){
	         partbDet = new Ext.Window({	                  
	             title:'乙方单位详情',
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
    	if (partbWindow!=null && !partbWindow.hidden){
    		loadFormPB();
    	}
    });
    
    gridPB.on('afterinsert',function(){
    	//smPB.getSelected().set('partybno',getNewPartyBNo());
    })

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
	var form = queryForm.getForm(), queStr = ' 1=1 ';
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
		
		dsPB.baseParams.params = queStr+" and "+pidWhereString;
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
    
   