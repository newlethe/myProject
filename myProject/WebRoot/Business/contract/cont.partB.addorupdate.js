var beanPB = "com.sgepit.pmis.contract.hbm.ConPartyb";
var businessPB = "baseMgm"
var listMethodPB = "findWhereOrderby"
var primaryKeyPB = "cpid"
var orderColumnPB = "partybno"
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

	var gridfilter = "pid = '" + currentPid + "'";
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
			fieldLabel: '乙方单位序号',
			allowBlank: false,
			anchor:'95%'
         }, 'partyb': {
			name: 'partyb',
			fieldLabel: '单位名称',
			allowBlank: false,
			anchor:'95%'
         }, 'partybshort': {
			name: 'partybshort',
			fieldLabel: '手机',
			anchor:'95%'
         }, 'partyblawer': {
			name: 'partyblawer',
			fieldLabel: '法定代表人',
			anchor:'95%'
         }, 'partybbank': {
			name: 'partybbank',
			fieldLabel: '开户行',
			anchor:'95%'
         }, 'partybbankno': {
			name: 'partybbankno',
			fieldLabel: '帐号',
			anchor:'95%'
         }, 'address': {
			name: 'address',
			fieldLabel: '单位地址',
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
    var smPB = new Ext.grid.CheckboxSelectionModel({singleSelect:true})
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
           width: 100,
           editor: new fm.TextField(fcPB['partybno'])
        },{
           id: 'partyb',                       
           header: fcPB['partyb'].fieldLabel,
           dataIndex: fcPB['partyb'].name,
           width: 300,
           editor: new fm.TextField(fcPB['partyb']),
           renderer :  function(data) {
                var qtip = "qtip=" + data;
                return '<span ' + qtip + '>' + data + '</span>';
                    return data;
                }
        },{
           id:'address',   
           header: fcPB['address'].fieldLabel,
           dataIndex: fcPB['address'].name,
           width: 170,
           editor: new fm.TextField(fcPB['address']),
           renderer :  function(data) {
                var qtip = "qtip=" + data;
                return '<span ' + qtip + '>' + data + '</span>';
                    return data;
                }
        
        },{
           id: 'partybbank',                  
           header: fcPB['partybbank'].fieldLabel,
           dataIndex: fcPB['partybbank'].name,
           width: 210,
           editor: new fm.TextField(fcPB['partybbank'])
        },{
           id: 'partybbankno',           
           header: fcPB['partybbankno'].fieldLabel,
           dataIndex: fcPB['partybbankno'].name,
           align:'right',
           width: 150,
           editor: new fm.TextField(fcPB['partybbankno'])
        },{
           id: 'partyblawer',                   
           header: fcPB['partyblawer'].fieldLabel,
           dataIndex: fcPB['partyblawer'].name,
           width: 80,
           editor: new fm.TextField(fcPB['partyblawer'])
        }
    ]);
    cmPB.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var ColumnsPB = [
    	{name: 'cpid', type: 'string'},		// Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'partybno', type: 'string'},    	
		{name: 'partyb', type: 'string'},
		{name: 'partyblawer', type: 'string'},
		{name: 'partybbank', type: 'string'},
		{name: 'partybbankno', type: 'string'},
        {name: 'address',   type: 'string'},
        {name: 'partybshort', type: 'string'},
		{name: 'postalcode', type: 'string'},
		{name: 'phoneno', type: 'string'},
		{name: 'email', type: 'string'},
		{name: 'homepage', type: 'string'},
		{name: 'fax', type: 'string'},
		{name: 'linkman', type: 'string'},
		{name: 'brief', type: 'string'}]
       
	var FieldsPB = ColumnsPB.concat([							//表单增加的列
		{name: 'address', type: 'string'},
		{name: 'partybshort', type: 'string'},
		{name: 'postalcode', type: 'string'},
		{name: 'phoneno', type: 'string'},
		{name: 'email', type: 'string'},
		{name: 'homepage', type: 'string'},
		{name: 'fax', type: 'string'},
		{name: 'linkman', type: 'string'},
		{name: 'brief', type: 'string'},
        {name: 'address', type: 'string'}
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
	    	params: gridfilter
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
       // autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows:true,
		viewConfig:{
			//forceFit: true,
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
      	saveBtn : true,
      	formHandler: popPartbDet,
		saveHandler: partybSaveHandler,
		insertHandler : insertPartBHandler,
		listeners : {
		    afterdelete : function (grid,ids,primaryKey,bean){
		               conpartybMgm.immediatelySendPartybDel(ids,bean,function (rtn){
		               })
		    }
		}
	});
    dsPB.load({params:{
	    	 start: 0,
	    	 limit:  PAGE_SIZE
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
                    title:'乙方单位详细情况',
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
    		for(i=0; i<records.length; i++) {
	    		var flag = true;
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
	    		if (flag){
		            DWREngine.setAsync(false);
		            conpartybMgm.insertConPartyb(records[i].data,function(rtn){ 
		            });
		            Ext.example.msg('保存成功！', '您成功修改了一条信息！');
		            DWREngine.setAsync(true);
		            dsPB.load({params:{start : 0 ,limit : PAGE_SIZE}});		
	    		}
	      
    		}
    		
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
	    		var ids = smPB.getSelected().get('cpid')
	    		baseMgm.findById( "com.sgepit.pmis.contract.hbm.ConPartyb",ids, function(rtn){
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
	    		doFormSavePB()
	    }
    }
    
    function doFormSavePB(){
        var basicForm = formPanelPB.getForm();
        var partybno = basicForm.findField('partybno').getValue();
        var partyb = basicForm.findField('partyb').getValue();
        var cpid = basicForm.findField('cpid').getValue();
        var pid = basicForm.findField('pid').getValue();
        var partyblawer = basicForm.findField('partyblawer').getValue();
        var linkman = basicForm.findField('linkman').getValue();
        var partybshort = basicForm.findField('partybshort').getValue();
        var partybbank = basicForm.findField('partybbank').getValue();
        var partybbankno =basicForm.findField('partybbankno').getValue();
        var postalcode = basicForm.findField('postalcode').getValue();
        var phoneno = basicForm.findField('phoneno').getValue();
        var fax = basicForm.findField('fax').getValue();
        var address = basicForm.findField('address').getValue();
        var email = basicForm.findField('email').getValue();
        var brief = basicForm.findField('brief').getValue();
        var obj = new Object();
            obj.partybno = partybno;
            obj.partyb = partyb;
            obj.partyblawer = partyblawer;
            obj.linkman = linkman;
            obj.partybshort = partybshort;
            obj.partybbank = partybbank;
            obj.partybbankno = partybbankno;
            obj.postalcode = postalcode;
            obj.phoneno = phoneno;
            obj.fax = fax;
            obj.address = address;
            obj.email = email;
            obj.brief = brief;
            if(cpid==''){
               obj.pid = currentPid;
            }else {
               obj.cpid = cpid;
               obj.pid = pid;
            }
            DWREngine.setAsync(false);
            conpartybMgm.insertConPartyb(obj,function(rtn){
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
				fieldLabel: '乙方单位序号',
				width: 183
			}]
		},{
			layout: 'form',
			border: false,
			width: 400,
			items: [{
				xtype: 'textfield',
				id: 'partyb',
				fieldLabel: '单位名称',
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
//		gridPB.getTopToolbar().add('-');
//   	gridPB.getTopToolbar().add('按首字母查询：');
//   	gridPB.getTopToolbar().add(selectByFirstWord);
    gridPB.getTopToolbar().add('-');  
   	gridPB.getTopToolbar().add(btnQuery); 
   	function insertPartBHandler(){
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
		formPanelPB.getForm().reset();
    	partbDet.show();
   	}   
})    
   