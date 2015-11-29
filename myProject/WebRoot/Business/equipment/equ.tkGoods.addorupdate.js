var bean = "com.sgepit.pmis.equipment.hbm.EquTkGoods";
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 设备入库信息维护";
var isApp = ''

Ext.onReady(function (){
  
    var fm = Ext.form;
    var initYear = new Date().getYear() + '-'
    
    var init = 'YHD-RKD-'+initYear
    var initBh = ''
    
    var partybName = '';
    var convalue = '';
    DWREngine.setAsync(false)
     baseMgm.getData("select b.partyb,a.convalue from con_ove a,con_partyb b where a.partybno=b.cpid and a.conno = '"+ conno +"'",function(_list){
			partybName = _list[0].PARTYB;
			convalue=_list[0].CONVALUE;
		})
	
    	equTkGoodsMgm.initTkGoodsBh(init,function(str){
    		initBh = str
    	})
    	bdgMoneyMgm.isMonneyApp(conid,function(flag){
    		isApp = flag
    	})
    DWREngine.setAsync(true)
    
//-----所属系统下拉树
    var treeRoot = new Ext.tree.AsyncTreeNode({
    	text:'工程费用',
    	iconCls:'form',
    	id:'0'
    })
    
    var treeLoader = new Ext.tree.TreeLoader({
    	url:MAIN_SERVLET,
    	baseParams:{
    		ac:'columntree',
    		treeName:'bdgMoneyTree',
    		businessName:'bdgMgm',
    		conid:conid,
    		conmoney:conmoney,
    		parent:'0'
    	},
    	clearOnLoad:true,
    	uiProviders:{
    		'col':Ext.tree.ColumnNodeUI
    	}
    })
    
    var treePanel = new Ext.tree.ColumnTree({
    	id:'budget-tree-panel',
    	iconCls:'icon-by-category',
    	region:'center',
    	width:500,
    	frame:false,
    	header:false,
    	border:false,
    	rootVisible:false,
    	lines:true,
    	autoScroll:false,
    	animate:false,
    	columns:[{
    		width:500,
    		dataIndex:'bdgname'
    	},{
    		width:0,
    		dataIndex:'bdgno'
    	}],
    	root:treeRoot,
    	loader:treeLoader
    })
    
    treePanel.on('beforeload',function(node){
    	bdgid = node.attributes.bdgid
    	if(bdgid == null)bdgid='0'
    	var baseParams = treePanel.loader.baseParams
    	baseParams.conid = conid
    	baseParams.conmoney = conmoney
    	baseParams.parent = bdgid
    })
    
    var comboxWithTree = new fm.ComboBox({
    	store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
    	mode:'local',
    	triggerAction:'all',
    	tpl:"<tpl><div style='height:900px'><div id='bdgtree'></div></div></tpl>",
		name:'sysbh',
		fieldLabel:'所属于安装系统编号',
		anchor:'95%',
		readOnly:true
    })
    
    comboxWithTree.on('expand',function(){
		if(isApp){
			treePanel.expand()
			treeRoot.expand()
			treePanel.render('bdgtree')		
		}else{
			Ext.Msg.alert('提示','该合同尚未进行合同分摊，无法选择所属系统!')
		}
    })
    
    treePanel.on('click',function(node){
    	comboxWithTree.setValue(node.attributes.bdgno)
    	Ext.getCmp('sysmc').setValue(node.attributes.bdgname)
    	comboxWithTree.collapse()
    })
    
    
//-------    
    
	var fc = {
		'conid': {
			name: 'conid',
			fieldLabel: '合同内部流水号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'ggid': {
			name: 'ggid',
			fieldLabel: '到货主键',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor: '95%'
		}, 'ggNo': {
			name: 'ggNo',
			fieldLabel: '编号',
			allowBlank: false,
			anchor:'95%'
		}, 'ggDate': {
			name: 'ggDate',
			fieldLabel: '到货日期',
			width:45,
            format: 'Y-m-d',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
			anchor:'95%'
		}, 'ggNum': {
			name: 'ggNum',
			fieldLabel: '数量',
			allowNegative: false,
            maxValue: 100000000,
            hidden: true,
			hideLabel: true,
            allowBlank: false,
			anchor:'95%'
		}, 'sgNo': {
			name: 'sgNo',
			fieldLabel: '发货通知单号',
			anchor:'95%'
		}, 'sgDate': {
			name: 'sgDate',
			fieldLabel: '发货日期',
			width:45,
            format: 'Y-m-d',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
			anchor:'95%'
		}, 'sgMan': {
			name: 'sgMan',
			fieldLabel: '发运人',
			anchor:'95%'
		}, 'incasementNo': {
			name: 'incasementNo',
			fieldLabel: '装箱号',
			anchor:'95%'
		}, 'conveyance': {
			name: 'conveyance',
			fieldLabel: '运输工具',
			anchor:'95%'
		}, 'conveyanceNo': {
			name: 'conveyanceNo',
			fieldLabel: '运输工具号',
			anchor:'95%'
		}, 'faceNote': {
			name: 'faceNote',
			fieldLabel: '外观记录',
			anchor:'95%'
		}, 'layPlace': {
			name: 'layPlace',
			fieldLabel: '放置位置',
			allowBlank: false,
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			height: 90,
			width: 730,
			xtype: 'htmleditor',
			anchor:'95%'
		},'tkrq':{
			name:'tkrq',
			fieldLabel:'退库日期',
			format: 'Y-m-d',
			readOnly:true,
			anchor:'95%'
		},'conmoney':{
			id:'conmoney',
			name:'conmoney',
			fieldLabel:'合同总金额',
			readOnly:true,
			anchor:'95%'
		},'partb':{
			id:'partb',
			name:'partb',
			fieldLabel:'乙方单位',
			readOnly:true,
			anchor:'95%'
		},'sbmc':{
			name:'sbmc',
			fieldLabel:'设备名称',
			anchor:'95%'
		},'dw':{
			name:'dw',
			fieldLabel:'单位',
			hidden: true,
			hideLabel: true,
			anchor:'95%'
		},'equipfee':{
			id:'equipfee',
			name:'equipfee',
			fieldLabel:'到货设备总金额',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'carryfee':{
			id:'carryfee',
			name:'carryfee',
			fieldLabel:'运保费',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'otherfee':{
			id:'otherfee',
			name:'otherfee',
			fieldLabel:'其它费用',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'toolfee':{
			id:'toolfee',
			name:'toolfee',
			fieldLabel:'专用工具金额 ',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'partfee':{
			id:'partfee',
			name:'partfee',
			fieldLabel:'备品备件金额',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},
			anchor:'95%'
		},'totalfee':{
			id:'totalfee',
			name:'totalfee',
			fieldLabel:'合计总金额',
			readOnly:true,
			anchor:'95%'
		},'sysbh':{
			name:'sysbh',
			fieldLabel:'所属于安装系统编号',
			anchor:'95%'
		},'sysmc':{
			id:'sysmc',
			name:'sysmc',
			fieldLabel:'所属安装系统名称',
			anchor:'95%',
			readOnly:true
		},'invoicebh':{
			name:'invoicebh',
			fieldLabel:'供货发票号',
			anchor:'95%'
		},'checkbh':{
			name:'checkbh',
			fieldLabel:'验收单号',
			anchor:'95%'
		},'conno':{
			id:'conno',
			name:'conno',
			hidden: true,
			hideLabel: true,
			fieldLabel:'合同号',
			anchor:'95%',
			readOnly:true
		}
	};
    
    // 3. 定义记录集
	var Columns = [
		{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'ggid', type: 'string'},
		{name: 'ggNo', type: 'string'},
		{name: 'ggDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ggNum', type: 'float'},
		{name: 'sgNo', type: 'string'},
		{name: 'sgDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'sgMan', type: 'string'},
		{name: 'incasementNo', type: 'string'},
		{name: 'conveyance', type: 'string'},
		{name: 'conveyanceNo', type: 'string'},
		{name: 'faceNote', type: 'string'},
		{name: 'layPlace', type: 'string'},
		{name: 'remark', type: 'string'},
		
		{name:'conno',type:'string'},
		{name:'partb',type:'string'},
		{name:'conmoney',type:'float'},
		{name:'sbmc',type:'string'},
		{name:'dw',type:'string'},
		{name:'equipfee',type:'float'},
		{name:'carryfee',type:'float'},
		{name:'otherfee',type:'float'},
		{name:'toolfee',type:'float'},
		{name:'partfee',type:'float'},
		{name:'totalfee',type:'float'},
		{name:'sysbh',type:'string'},
		{name:'sysmc',type:'string'},
		{name:'invoicebh',type:'string'},
		{name:'checkbh',type:'string'},
		{name:'tkrq', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		
	];
	
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (ggid == null || ggid == 'null' || ggid == ''){
    	loadFormRecord = new formRecord({
			conid: conid,
			pid: CURRENTAPPID,
			ggid: '',
			ggNo: initBh,
			ggNum: 0,
			sgNo: '',
			sgMan: '',
			incasementNo: '',
			conveyance: '',
			conveyanceNo: '',
			faceNote: '',
			layPlace: '',
			remark: '',
			
			conno:parent.conno,
			partb:partybName,
			conmoney:convalue,
			sbmc:'',
			dw:'',
			equipfee:0,
			carryfee:0,
			otherfee:0,
			toolfee:0,
			partfee:0,
			totalfee:0,
			sysbh:'',
			sysmc:'',
			invoicebh:'',
			checkbh:'',
			tkrq:new Date()
			
			
	    });
    } else {
    	DWREngine.setAsync(false);
	    baseMgm.findById(bean, ggid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
	    DWREngine.setAsync(true);
	} 	

    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        region: 'center',
        bodyStyle: 'padding:10px 10px;',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	items: [
    			new Ext.form.FieldSet({
    			title: '到货基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		   						 new fm.TextField(fc['ggNo']),
		   						 new fm.NumberField(fc['conmoney']),
		                		 //new fm.TextField(fc['dw']),
		                		 new fm.NumberField(fc['carryfee']),
		                		 new fm.NumberField(fc['partfee']),
		                		 new fm.TextField(fc['sysmc']),
		                		 
		                		 new fm.TextField(fc['conid'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['tkrq']),
				            	new fm.TextField(fc['partb']),
				            	//new fm.NumberField(fc['ggNum']),
				            	new fm.NumberField(fc['otherfee']),
				            	new fm.NumberField(fc['totalfee']),
				            	new fm.TextField(fc['invoicebh']),
				            	
				            	new fm.TextField(fc['pid'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
	    						//new fm.TextField(fc['conno']),
				            	//new fm.TextField(fc['sbmc']),
				            	new fm.NumberField(fc['equipfee']),
				            	new fm.NumberField(fc['toolfee']),
				            	//new fm.TextField(fc['sysbh']),
				            	comboxWithTree,
				            	new fm.TextField(fc['checkbh']),
				            	
				            	
				            	new fm.TextField(fc['ggid'])
    					      ]
    				  }    				
    			]
    		}),
   			new Ext.form.FieldSet({
    			layout: 'form',
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [
   					new fm.TextArea(fc['remark'])
//   					fc['remark']
                   	
				]
    		})
    	],
		buttons: [{
			id: 'save',
            text: '保存',
            disabled: false,
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
//            	history.back();
            	parent.aouWindow.hide();
            }
        }]
        
    });

     var contentPanel = new Ext.Panel({
        border: false,
        header : false,
        region:'center',
        tbar: [
    			new Ext.Button({
					text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>',
					iconCls: 'title'
				})//,'->', 
//				new Ext.Button({
//					text: '返回',
//					iconCls: 'returnTo',
//					handler: function(){
//						history.back();
////						var url = BASE_PATH+"Business/equipment/equ.getGoods.input.jsp?";
////			    		window.location.href = url + "conid=" + conid 
////							+ "&conname=" + conname + "&conno=" + conno;
//					}
//				})
		],
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[formPanel]
    });
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [contentPanel]
    });
    
    //数据加载
    formPanel.getForm().loadRecord(loadFormRecord);
    Ext.getCmp('conmoney').setValue(convalue)
    Ext.getCmp('partb').setValue(partybName)
    //alert(parent.conno)
    //Ext.getCmp('conno').setValue(parent.conno)

    function formSave(){
    	var form = formPanel.getForm()
    	if (form.isValid()){
    		if(ggid == ''){
	     		var bhvalue = form.findField('ggNo').getValue()
	    		checkTkGoodsbh(bhvalue)
    		}else{
    			doFormSave();    		
    		}
	    }
    }
    
    //考虑到此页面可能存在在多个机器上被打开添加数据而导致自动编号重复的现象的可能性，所以增加了编号重复的判断
    function checkTkGoodsbh(value){
    	if(value.substring(0,13) == init){
    		var bhReg = /^[0-9]+$/
    		var lastbh = value.split('-')[3]
    		if(bhReg.test(lastbh) && lastbh.length==3){
    			DWREngine.setAsync(false)
    				equTkGoodsMgm.checkBhExist(value,function(flag){
    					if(flag){
    						doFormSave()
    					}else{
    						Ext.Msg.alert('提示','编号为:'+value+'的数据以存在!<br>请尝试在最后一位加1后重试')
    					}
    				})
    			DWREngine.setAsync(true)
    		}else{
    			Ext.Msg.alert('提示','形如<font color=red>YHD-RKD-年份-</font>的编号的结尾必须是三位数字')
    		}
    	}
    }
    
    function doFormSave(dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.ggid == '' || obj.ggid == null){
	   		equTkGoodsMgm.insertTkGoods(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				Ext.Msg.show({
					   title: '提示',
					   msg: '是否继续新增?　　　',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
	   		});
   		}else{
   			equTkGoodsMgm.updateTkGoods(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
//	   				window.location.href = BASE_PATH+"Business/equipment/equ.getGoods.input.jsp?conid="
//		    			+ conid + "&conname=" + conname + "&conno="+conno+ "&conmoney="+conmoney;
	   				parent.aouWindow.hide();
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function processResult(value){
    	if ("yes" == value){
    		var url = BASE_PATH+"Business/equipment/equ.tkGoods.addorupdate.jsp?conid=" 
    			+ conid + "&conname=" + conname + "&conno="+conno+ "&conmoney="+conmoney;
			window.location.href = url;
    	}else{
//    		history.back();
    		parent.aouWindow.hide();
    	}
    }

});




