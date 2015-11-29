var bean = "com.sgepit.pmis.equipment.hbm.EquGetGoodsArr";
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 设备到货信息维护";
var conveyanceType = [['汽运','汽运'],['海运','海运'],['空运','空运']]
var dhztType = [['发货','发货'],['到货','到货']]

Ext.onReady(function (){
  
    var fm = Ext.form;
    
    var conveyanceDs = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data:conveyanceType
    })
    var dhztstore = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data:dhztType
    })
    
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
			fieldLabel: '到货批号<font color=red>*</font>',
			allowBlank: false,
			readOnly: true,
			anchor:'95%'
		}, 'ggDate': {
			name: 'ggDate',
			fieldLabel: '实际到货日期',
			//width:45,
            format: 'Y-m-d',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
			anchor:'95%'
		}, 'ggNum': {
			name: 'ggNum',
			fieldLabel: '到货件数',
			allowNegative: false,
            maxValue: 100000000,
            //allowBlank: false,
			anchor:'95%'
		}, 'sgNo': {
			name: 'sgNo',
			fieldLabel: '发货通知单号',
			anchor:'95%'
		}, 'sgDate': {
			name: 'sgDate',
			fieldLabel: '发货日期',
			width:45,
            format: 'Y-m-d H:i:s',
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
			displayField:'v',
			valueField:'k',
			mode:'local',
			typeAhead:true,
			triggerAction:'all',
			editable:false,
			store:conveyanceDs,
			lazyRender:true,
			listClass:'x-combo-list-small',			
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
			height: 120,
			width: 730,
			xtype: 'htmleditor',
			anchor:'95%'
		}, 'receivenum': {
			name: 'receivenum',
			fieldLabel: '到货单号',
			anchor:'95%'
		}, 'yjfhrq': {name: 'yjfhrq',fieldLabel: '预计发货日期', format: 'Y-m-d',minValue: '2000-01-01',hidden: true,anchor:'95%'
		}, 'sjfhrq': {name: 'sjfhrq',fieldLabel: '实际发货日期', format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'yjdhrq': {name: 'yjdhrq',fieldLabel: '预计到货日期', format: 'Y-m-d',minValue: '2000-01-01',hidden: true,anchor:'95%'
		}, 'csno': {name: 'csno',fieldLabel: '供货厂商',anchor:'95%'
		}, 'dhph': {name: 'dhph',fieldLabel: '到货批号',anchor:'95%'
		}, 'fhtzd': {name: 'fhtzd',fieldLabel: '发货通知单编号',hidden: true,anchor:'95%'
		}, 'fhgz': {name: 'fhgz',fieldLabel: '发货港站',anchor:'95%'
		}, 'dhgz': {name: 'dhgz',fieldLabel: '到货港站',anchor:'95%'
		}, 'thr': {name: 'thr',fieldLabel: '提货人',anchor:'95%'
		}, 'fph': {name: 'fph',fieldLabel: '发票号',anchor:'95%'
		}, 'fpje': {name: 'fpje',fieldLabel: '发票金额',anchor:'95%'
		}, 'dhzt': {name: 'dhzt',fieldLabel: '到货状态',anchor:'95%',
			displayField:'v',valueField:'k',
			mode:'local',typeAhead:true,triggerAction:'all',editable:false,
			store:dhztstore,
			lazyRender:true,listClass:'x-combo-list-small'
		}, 'conjh_date': {name: 'conjh_date',fieldLabel: '合同交货日期', format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'consj_date': {name: 'consj_date',fieldLabel: '实际交货日期', format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'
		}, 'conys': {name: 'conys',fieldLabel: '运输合同',anchor:'95%'
		}, 'dhsb': {name: 'dhsb',fieldLabel: '到货设备概述',anchor:'95%',allowBlank: false,xtype: 'textarea',height: 120,width: 730
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
		{name: 'receivenum', type: 'string'},
		{name:'yjfhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'sjfhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'yjdhrq',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'csno',type:'string'},
		{name:'dhph',type:'string'},
		{name:'fhtzd',type:'string'},
		{name:'fhgz',type:'string'},
		{name:'dhgz',type:'string'},
		{name:'thr',type:'string'},
		{name:'fph',type:'string'},
		{name:'fpje',type:'float'},
		{name:'dhzt',type:'string'},
		{name:'conjh_date',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'consj_date',type:'date', dateFormat: 'Y-m-d H:i:s'},
		{name:'conys',type:'string'},
		{name:'dhsb',type:'string'}		
	];
	
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (ggid == null || ggid == 'null' || ggid == ''){
    	loadFormRecord = new formRecord({
			conid: conid,
			pid: CURRENTAPPID,
			ggid: '',
			ggNo: ggno,
			ggNum: 0,
			sgNo: '',
			sgMan: '',
			incasementNo: '',
			conveyance: '',
			conveyanceNo: '',
			faceNote: '',
			layPlace: '',
			remark: '',
			receivenum:'',
			ggDate :new Date,
			
			yjfhrq:'',sjfhrq:'', yjdhrq:'',
		    csno:'', dhph:'',fhtzd:'',fhgz:'', dhgz:'',thr:'',fph:'',
		    fpje:0,dhzt:'', conjh_date:'',consj_date:'', conys:'',dhsb:''	
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
	   							 new fm.TextField(fc['receivenum']),
		              	  		 new fm.TextField(fc['sgNo']),
		                		new fm.TextField(fc['incasementNo']),
		                		
		                		
		                		new fm.ComboBox(fc['dhzt']),
		                		new fm.TextField(fc['conys']),
		                		//new fm.TextField(fc['csno']),
		                		new Ext.form.TriggerField({
		                			name:'csno',
		                			id:'getCsFromList',
		                			fieldLabel:'供货厂商',
		                			triggerClass: 'x-form-date-trigger',
			    					readOnly: true, selectOnFocus: true,
			    					anchor:'95%',
			    					onTriggerClick:getParamsFromList
		                		}),
		                		new fm.TextField(fc['conid'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['layPlace']), 
    							new fm.DateField(fc['conjh_date']),   							
    							new fm.DateField(fc['sjfhrq']),    							
    							new fm.DateField(fc['ggDate']),
    							//new fm.DateField(fc['consj_date']),
    							new fm.TextField(fc['thr']),    							
				            	//new fm.DateField(fc['sgDate']),
				            	new fm.TextField(fc['faceNote']),
				            	new fm.NumberField(fc['ggNum'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[	
    							new fm.TextField(fc['fph']),
    							new fm.NumberField(fc['fpje']),    							
    							//new fm.TextField(fc['dhph']),
    							new fm.TextField(fc['fhgz']),
    							new fm.TextField(fc['dhgz']),
	    						
				            	new fm.TextField(fc['sgMan']),
				            	new fm.ComboBox(fc['conveyance']),
				            	new fm.TextField(fc['conveyanceNo']),
				            	new fm.TextField(fc['ggid']),
				            	new fm.TextField(fc['pid'])
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
   					//new fm.TextArea(fc['context']),
   					//fc['remark'],
   					fc['dhsb']
                   	
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
				})],
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

    function formSave(){
    	var form = formPanel.getForm()
    	if (form.isValid()){
    		doFormSave();
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
    			if(n=="conid"){
	    			obj[n]=obj[n].replace("'", "")
	    			obj[n]=obj[n].replace("'", "")
    			}
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.ggid == '' || obj.ggid == null){
	   		equGetGoodsArrMgm.insertGetGoods(obj, function(){
	   			/*
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				Ext.Msg.show({
					   title: '提示',
					   msg: '是否继续新增?　　　',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
				*/
				if(isFlwTask != true){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				parent.aouWindow.hide();
   				}else{
					Ext.Msg.show({
					   title: '保存成功！',
					   msg: '您成功新增了一条设备到货主信息！　　　<br>下一步进行选择设备或部件！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO,
					   fn: function(value){
					   		if ('ok' == value){
								parent.aouWindow.hide();
								//var url = BASE_PATH+"Business/wzgl/stock/wz.stockgl.applyPlan.jsp?isFlwTask=true&bhflow="+obj.bh;
								//window.location.href = url;
					   		}
					   }
					});	   				
   				}
	   		});
   		}else{
   			equGetGoodsArrMgm.updateGetGoods(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
//	   				window.location.href = BASE_PATH+"Business/equipment/equ.getGoods.arr.input.jsp?conid="
//		    			+ conid + "&conname=" + conname + "&conno="+conno;
	   				parent.aouWindow.hide();
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function processResult(value){
    	if ("yes" == value){
    		var url = BASE_PATH+"Business/equipment/equ.getGoods.arr.addorupdate.jsp?conid=" 
    			+ conid + "&conname=" + conname + "&conno="+conno;
			window.location.href = url;
    	}else{
//    		history.back();
    		parent.aouWindow.hide();
    	}
    }
	 
	 function getParamsFromList(cmp){
		 var rtn = window.showModalDialog(BASE_PATH + 'Business/equipment/equ.getGoods.arrival.selectCs.jsp',"","dialogWidth:900px;dialogHeight:600px;center:yes;resizable:yes;")
		 Ext.getCmp('getCsFromList').setValue(rtn)
	}
	
});




