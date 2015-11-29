var bean = "com.sgepit.pmis.equipment.hbm.EquOpenBox"
var primaryKey = "uuid"
var orderColumn = "conid"
var formPanelTitle = "新增一条记录"
var pid = CURRENTAPPID; 
var formWindow;
var myWindow;
var singleObj;
var ggid="";
Ext.onReady(function (){
	var dhztType = [['0','申请开箱'],['1','开箱检验'],['2','通过检验'],['3','未通过检验']]
	var jzhType = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号',function(list){         //获取机组号
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				jzhType.push(temp);		
			}
	    });
    DWREngine.setAsync(true);
	
	
	var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    });  
	var dhztstore = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data:dhztType
    })
	if(uuids.split(',').length ==1){
		DWREngine.setAsync(false);  
		baseMgm.getData("select * from equ_sbdh_arr where uuid = '"+ uuids.split(',')[0] +"'",function(_list){
			singleObj = _list[0];
		})
		DWREngine.setAsync(true);  
	}
	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + uuids 
		    		+ "&conno="+conno+"&conid=" + conid + "&conname=" + conname + "&partId=" + partId + "&uuid=" + uuid;
		}
	});

  // 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'uuid': {
    	 	id:'uuid',
			name: 'uuid',
			fieldLabel: '开箱主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'conid': {
         	id:'conid',
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
         	id:'pid',
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'ggId': {
         	id:'ggId',
			name: 'ggId',
			fieldLabel: '到货批次',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'buildPart': {
         	id:'buildPart',
			name: 'buildPart',
			fieldLabel: '供货单位',
			anchor:'95%'
         }, 'fixPart': {
         	id:'fixPart',
			name: 'fixPart',
			fieldLabel: '安装单位',
			anchor:'95%'
         },  'boxno': {
         	id:'boxno',
			name: 'boxno',
			fieldLabel: '开箱单号',
			readOnly : true,
			allowBlank:false,
			anchor:'95%'
         },'opendate': {
         	id:'opendate',
			name: 'opendate',
			fieldLabel: '开箱日期',
			//width:45,
            format: 'Y-m-d',
            allowBlank: true, 
//            minValue: '2000-01-01',
			anchor:'95%'
         },'checkdate': {
         	id:'checkdate',
			name: 'checkdate',
			fieldLabel: '到货日期',
			//width:45,
            format: 'Y-m-d',
            readOnly:true,
            allowBlank: true,
//            minValue: '2000-01-01',
			anchor:'95%'
         }, 'appearance': {
         	id:'appearance',
			name: 'appearance',
			fieldLabel: '外观记录', 
			height:50, 
			hideLabel:true,
			anchor:'95%'
         },'equipment': {
         	id:'equipment',
			name: 'equipment',
			fieldLabel: '设备及附件外观质量情况',
			height:50,
			hideLabel:true,
			anchor:'95%'
         },'filedetail': {
         	id:'filedetail',
			name: 'filedetail',
			fieldLabel: '质量证明文件， 技术资料',
			height:50, 
			hideLabel:true,
			anchor:'95%'
         },'problems': {
         	id:'problems',
			name: 'problems',
			fieldLabel: '存在的问题及处理意见 ',
			height:50,
			hideLabel:true,
			anchor:'95%'
         },'openAddress': {
         	id:'openAddress',
			name: 'openAddress',
			fieldLabel: '开箱地点',
			anchor:'95%'
         },'comments': {
         	id:'comments',
			name: 'comments',
			fieldLabel: '开箱检验评定 ',
			height:50,
			hideLabel:true,
			anchor:'95%'
         } ,'partno': {
         	id:'partno',
			name: 'partno',
			fieldLabel: '部件号 ',
			anchor:'95%'
         } ,'bz': {
         	id:'bz',
			name: 'bz',
			fieldLabel: '备注 ',
			hideLabel:true,
			anchor:'95%'
         } ,'jzh': {
         	id:'jzh',
			name: 'jzh',
			fieldLabel: '机组号 ',
			readOnly:true,
			anchor:'95%'
         } ,'sysbh': {
         	id:'sysbh',
			name: 'sysbh',
			fieldLabel: '系统 ',
			anchor:'95%'
         } ,'sysmc': {
         	id:'sysmc',
			name: 'sysmc',
			fieldLabel: '系统名称 ',
			anchor:'95%'
         } ,'sbmc': {
         	id:'sbmc',
			name: 'sbmc',
			fieldLabel: '到货设备概述 ',
			allowBlank: false,
			anchor:'95%'
         }  ,
         'kxzt': { name: 'kxzt',fieldLabel: '开箱状态',anchor:'95%',
         	displayField:'v',valueField:'k',
			mode:'local',typeAhead:true,triggerAction:'all',editable:false,
			store:dhztstore,
			lazyRender:true,listClass:'x-combo-list-small'
         },         
         'ghfwys': { name: 'ghfwys',fieldLabel: '供货范围验收',anchor:'95%'},         
         'qdys': { name: 'qdys',fieldLabel: '清单验收',anchor:'95%'},         
         'zlys': { name: 'zlys',fieldLabel: '资料验收',anchor:'95%'},         
         'hjdwjry': { name: 'hjdwjry',fieldLabel: '会检单位及人员',anchor:'95%'}  
    }
	
    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'uuid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'boxno', type: 'string'},
		{name: 'ggId', type: 'string'},
		{name: 'opendate', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'checkdate', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'appearance', type: 'string'},
		{name: 'equipment', type: 'string'},
		{name: 'filedetail', type: 'string'},
		{name: 'problems', type: 'string'},
		{name: 'buildPart', type: 'string'},
		{name: 'fixPart', type: 'string'},
		{name: 'openAddress', type: 'string'},
		{name: 'comments', type: 'string'},
		{name: 'partno', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'sysbh', type: 'string'},
		{name: 'sysmc', type: 'string'},
		{name: 'sbmc', type: 'string'},
		{name: 'kxzt', type: 'float'},
		{name: 'ghfwys', type: 'string'},
		{name: 'qdys', type: 'string'},
		{name: 'zlys', type: 'string'},
		{name: 'hjdwjry', type: 'string'}
		];
    var formRecord = Ext.data.Record.create(Columns);			//定义记录集   	
    var loadFormRecord = null;
    if (uuid == null ||uuid == 'null' || uuid == ''){
    	
    	loadFormRecord = new formRecord({								//设置初始值 
	    	uuid: null,
	    	conid: conid,
	    	pid: CURRENTAPPID,
	    	boxno:boxno,
	    	ggId: '',
	    	opendate: '',
	    	checkdate: '',
	    	buildPart: partB,
	    	fixPart: '',
	    	openAddress: '',
	    	appearance: '',
	    	equipment: '',
	    	filedetail: '',
	    	problems: '',
	    	comments: '',
	    	partno:'',
	    	bz:'',
	    	jzh:'',
	    	sysbh:'',
	    	sysmc:'',
	    	sbmc:'',
	    	kxzt:0,ghfwys:'',qdys:'',zlys:'',hjdwjry:''
    });	
    } 
	if (uuid != '' && uuid !=null && uuid != 'null'){
    	DWREngine.setAsync(false);
	    baseMgm.findById(bean, uuid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
	    DWREngine.setAsync(true);
	}

    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id:'form-panel',
        border: false,
        header : false,
    	iconCls: 'icon-detail-form',	//面板样式
    	width : 200,
        height: 200,
        minSize: 100,
        region: 'center',
        split:true,
    	collapsible: true,
    	collapseMode: 'mini',
    	autoScroll: true,
    	labelAlign: 'left',
    	bodyStyle:'padding:8px 8px',
    	items: [
    			new Ext.form.FieldSet({
    			title: '开箱基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', 
	   					columnWidth: .4,
	   					bodyStyle: 'border: 3px;',
	   					items:[
		                		 new fm.TextField(fc['boxno']),
		                		 new fm.TextField(fc['buildPart']),
		                		 new fm.TextField(fc['openAddress']),
		                		 //new fm.TextField(fc['partno']),
		                		 //new fm.TextField(fc['jzh']),
		                		 new fm.ComboBox({
		                		 	fieldLabel:'机组号',
		                		    name:'jzh',
			                        readOnly : true,
			                        //width:90,
			                        store:dsJzh,
			                        valueField: 'k',
			                        displayField: 'v',
			                        triggerAction: 'all',
			                        mode: 'local'
		                		 }),
		                		 //new fm.TextField(fc['sbmc']),
		                		 new Ext.form.TriggerField({
		                			name:'sbmc',
		                			id:'getsbFromList',
		                			fieldLabel:'到货设备概述',
		                			triggerClass: 'x-form-date-trigger',
			    					readOnly: true, selectOnFocus: true,
			    					anchor:'95%',
			    					allowBlank:false,
			    					onTriggerClick:getParamsFromList
		                		 }),
		                		 //new fm.ComboBox(fc['kxzt']),
		                		 new fm.TextField(fc['ghfwys']),
		                		 new fm.TextField(fc['qdys'])
	   						   ]
    				},{
    					layout: 'form', 
    					columnWidth: .4,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['opendate']),
				            	new fm.DateField(fc['checkdate']),
				            	new fm.TextField(fc['fixPart']),
				            	new fm.TextField(fc['sysbh']),
				            	new fm.TextField(fc['sysmc']),
				            	new fm.TextField(fc['zlys']),
				            	new fm.TextField(fc['hjdwjry'])
    						   ]
    				},{
    					layout: 'form', 
    					columnWidth: 0.0,
    					bodyStyle: 'border: 0px;',
    					items:[
	    						new fm.TextField(fc['uuid']),
				            	new fm.TextField(fc['pid']),
				            	new fm.TextField(fc['ggId']), 
				            	new fm.TextField(fc['conid'])
    					      ]
    				  }    				
    			]}),
	   			new Ext.form.FieldSet({
	   				layout: 'form',
	            	border:true, 
	            	title:'开箱检查记录',
	            	cls:'x-plain',  
	            	items: [ new fm.TextArea(fc['appearance']) ]
	    		}),
	    		new Ext.form.FieldSet({
	    			layout: 'form',
	            	border:true, 
	            	title:'设备及附件外观质量情况，数量是否齐全',
	            	cls:'x-plain',  
	            	items: [ new fm.TextArea(fc['equipment']) ]
	    		}),
	    		new Ext.form.FieldSet({
	    			layout: 'form',
	            	border:true, 
	            	title:'质量证明文件， 技术资料 等名称和数量',
	            	cls:'x-plain',  
	            	items: [ new fm.TextArea(fc['filedetail']) ]
	    		}),
	    		new Ext.form.FieldSet({
	    			layout: 'form',
	            	border:true, 
	            	title:'开箱检查异常情况处理意见',
	            	cls:'x-plain',  
	            	items: [ new fm.TextArea(fc['problems']) ]
	    		}),
	    		new Ext.form.FieldSet({
	    			layout: 'form',
	            	border:true, 
	            	title:'开箱检验评定',
	            	cls:'x-plain',  
	            	items: [ new fm.TextArea(fc['comments']) ]
	    		}),
	    		new Ext.form.FieldSet({
	    			layout: 'form',
	            	border:true, 
	            	title:'备注',
	            	cls:'x-plain',  
	            	items: [ new fm.TextArea(fc['bz']) ]
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
            handler: formCancel
        }]
        
    });

     var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        header : false,
        layout:'border',
        region:'center',
        split:true,
        tbar : [{
					text: '<font color=#15428b><b>&nbsp;开箱记录编辑页</b></font>',
					iconCls: 'title'
				}, '->',btnReturn],
        items:[formPanel]
    });
    
     

	// 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ 								// create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [contentPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [contentPanel]
        });
    }
    
    formPanel.getForm().loadRecord(loadFormRecord);
    
   	if(uuids.split(',').length ==1){
    	var _baseform = formPanel.getForm();
    	if(singleObj){
	    	_baseform.findField('jzh').setValue(singleObj.JZH);
	    	_baseform.findField('sbmc').setValue(singleObj.SBMC);
			baseMgm.getData("select * from equ_get_goods_arr where ggid = '"+ singleObj.DH_ID +"'",function(_list_0){
				_baseform.findField('checkdate').setValue(formatDateTime(_list_0[0].GG_DATE));
			})    
    	}
    }
 	
    function formSave(){
    	var form = formPanel.getForm()
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true)
	    	} else {
	    		doFormSave(false)
	    	}
	    }
    }
    
    function doFormSave(isNew){
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
    	
    	if (obj.uuid == '' || obj.uuid == null){
	   		openBoxMgm.insertEquOpenBox(obj, uuids, function(_uuid){
   				if(isFlwTask != true){
   					Ext.example.msg('保存成功！', '您成功新增了一条信息！');
   					window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + uuids 
							    		+ "&conid=" + conid + "&conno=" + conno+"&conname=" + conname + "&partId=" + partId + "&uuid=" + _uuid;
	   			}else{
					Ext.Msg.show({
					   title: '保存成功！',
					   msg: '您成功新增了一条设备开箱信息！　　　<br>下一步对开箱设备进行进行填写开箱信息！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO,
					   fn: function(value){
					   		if ('ok' == value){
					   			window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + uuids 
					    		+ "&conid=" + conid + "&conno=" + conno+"&conname=" + conname + "&partId=" + partId + "&uuid=" + _uuid+"&isTask=true&boxno="+boxno;
					   		}
					   }
					});	   		
   				}
   				//第一次添加完成后自动更新总验收数量
   				//_uuid 新添加的主表id
   				var sbids = new Array();
				baseMgm.getData("select sb_id from equ_open_box_sub where open_id='"+_uuid+"'",function(list){
					sbids = list;
				})
				//2010-12-22 执行更新总开箱验收数量
				for(var i=0;i<sbids.length;i++){
					var sumSql = "select sum(opensl) from equ_open_box_sub where sb_id='"+sbids[i]+"' and open_id in (select uuid from equ_open_box t where conid='"+conid+"')"
		   			var sql = "update equ_list set yszsl=("+sumSql+") where conid='"+conid+"' and sb_id='"+sbids[i]+"'";
		   			//document.write(sql)
		   			baseDao.updateBySQL(sql,function(str){
		   			//	alert(str)
		   			})
	   			}
   					   				   				
	   		});
   		}else{
   			openBoxMgm.saveOrUpdate(obj, function(){
   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
   				if(isFlwTask != true){
					window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + uuids 
			    		+ "&conid=" + conid  + "&conno=" + conno+ "&conname=" + conname + "&partId=" + partId + "&uuid=" + uuid;
			   }else{
			   		window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + uuids 
			    		+ "&conid=" + conid  + "&conno=" + conno+ "&conname=" + conname + "&partId=" + partId + "&uuid=" + uuid+"&isTask=true&boxno="+boxno;
			   }
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function formCancel(){
 		if(isFlwTask != true && isFlwView != true){
 			window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + uuids 
		    		+ "&conid=" + conid +  "&conno=" + conno+"&conname=" + conname + "&partId=" + partId + "&uuid=" + uuid;
 		}else{
 			window.location.href = BASE_PATH+"Business/equipment/equ.openBox.input.jsp?uuids=" + uuids 
		    		+ "&conid=" + conid +  "&conno=" + conno+"&conname=" + conname + "&partId=" + partId + "&uuid=" + uuid+"&isTask=true&boxno="+boxno;
 		}
    }
    
    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    };    

    function getParamsFromList(){
    	var obj = new Object();
    	obj.conid = conid;
    	obj.uuid = uuid;
    	var rtn = window.showModalDialog(BASE_PATH + 'Business/equipment/equ.openBox.selecsbdh.jsp' ,obj,"dialogWidth:900px;dialogHeight:600px;center:yes;resizable:yes;")
	    if(rtn){
		    Ext.getCmp('getsbFromList').setValue(rtn.split("||")[0]);
		    Ext.getCmp('buildPart').setValue(rtn.split("||")[1]) ;
		    var dt = new Date(rtn.split("||")[2]);
		    Ext.getCmp('checkdate').setValue(dt);
		    Ext.getCmp('ggId').setValue(rtn.split("||")[3]) ;
		    ggid = rtn.split("||")[3] ;
	    }
    }
	if(isFlwTask || isFlwView){
		Ext.getCmp("boxno").setDisabled(true)
	}
});




