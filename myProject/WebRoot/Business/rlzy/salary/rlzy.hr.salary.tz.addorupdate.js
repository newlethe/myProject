var bean = "com.sgepit.pmis.rlzj.hbm.HrAccountSet"
var primaryKey = 'uids'
var param_com , kmSel_com, symbol_com,kmTypeBox,kmSelStore;
var kmArr=new Array(),partbWindow;
var formPanel;
var kArr=new Array();
var state_com;
var paramArr =new Array();
var billArray = new Array();
var  symbol_com=new Array();
var symbol_arr =[['=','='],['-','-'],['+','+'],['*','*'],['/','/'],['(','('],[')',')']]
var viewport, deptBox;
Ext.onReady(function(){ 	
	
	DWREngine.setAsync(false);
	 baseMgm.getData("select zb_seqno,name from sgcc_guideline_info where parentid='005' order by zb_seqno ",function(list){
	 	for(var i=0;i<list.length;i++){
	 		var temp = new Array();
	 		temp.push("ITEM:"+list[i][0]);
	 		temp.push(list[i][1]);
	 		kmArr.push(temp);
	 	}
	 })
	DWREngine.setAsync(true);
		DWREngine.setAsync(false);
	 baseMgm.getData("select zb_seqno,name from sgcc_guideline_info where parentid='005' order by zb_seqno ",function(list){
	 	for(var i=0;i<list.length;i++){
	 		var temp = new Array();
	 		temp.push(list[i][0]);
	 		temp.push(list[i][1]);
	 		kArr.push(temp);
	 	}
	 })
	DWREngine.setAsync(true);
	
	DWREngine.setAsync(false);
	appMgm.getCodeValue('有效状态',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			billArray.push(temp);			
		}
    }); 
	DWREngine.setAsync(true);
	
	DWREngine.setAsync(false);
	 baseMgm.getData("select uids,name from hr_salary_basic_info",function(list){
	 	for(var i=0;i<list.length;i++){
	 		var temp = new Array();
	 		temp.push("PARAM:"+list[i][0]);
	 		temp.push(list[i][1]);
	 		paramArr.push(temp);
	 	}
	 })
	DWREngine.setAsync(true);
	
	var billStore =  new Ext.data.SimpleStore({
		id:'state',
		fields : ['k','v'],
		data:billArray
	});
	

	
	
	var paramStore = new Ext.data.SimpleStore({
		id : 'param',
		fields : ['k','v'],
		data:paramArr
	});
	
	var symbStore = new Ext.data.SimpleStore({
		id:'symb',
		fields : ['k','v'],
		data : symbol_arr
	})
	//----------------------物资维护信息----------------------------//
    var BUTTON_CONFIG = {
    	'BACK': {text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		},'SAVE': {
			id: 'save',
	        text: '保存',
	        handler: formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        handler: function(){
	        	history.back();
	        }
	    }
    };	
    var fm = Ext.form;
	var fc = {
		'uids':{name:'uids',fieldLabel:'系统编号',hidden:true,hideLabel:true},
		'code':{name:'code',fieldLabel:'帐套编码', anchor:'95%'},
		'name':{name:'name',fieldLabel:'帐套名称', anchor:'95%'},
		'items':{name:'items',fieldLabel:'工资科目', anchor:'95%'},
		'formula':{name:'formula',fieldLabel:'计算公式',xtype:'textarea',allowBlank:true,height:80,anchor:'95%'},
		'remark':{name:'remark',fieldLabel:'备注',xtype:'textarea',height:130, anchor:'95%'},
		'state':{name:'state',fieldLabel:'有效状态'}	
	}
	

	state_com = new Ext.form.ComboBox({
		name : 'state',
		fieldLabel:'有效状态',
		store:billStore,
		displayField : 'v',
		valueField : 'k',
		readOnly : true,
		triggerAction: 'all',
		mode: 'local',
		anchor:'95%'
	})
	 symbol_com = new fm.ComboBox({
		id : 'symbol',
		fieldLabel:'符号',
		width:120,
		Height:20,
		store:symbStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction: 'all',
		mode: 'local',
		listeners:{'select':function(combo,record,index){
			var form = formPanel.getForm();
			var text =form.findField('formula').getValue();
			form.findField('formula').setValue(text+record.data.v)
        }},
		anchor:'95%'
	})
	 param_com = new fm.ComboBox({
		id : 'param',
		fieldLabel:'参数',
		Height:20,
		store:paramStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction: 'all',
		mode: 'local',
		listeners:{'select':function(combo,record,index){
			var form = formPanel.getForm();
			var text =form.findField('formula').getValue();
			form.findField('formula').setValue(text+record.data.v)
        }},
		anchor:'95%'
	})
	
	kmSelStore = new Ext.data.SimpleStore({
				id : 'km',
				fields : ['k','v']
	});

	 kmSel_com = new fm.ComboBox({
		id : 'kmsel',
		fieldLabel:'工资科目',
		Height:20,
		store:kmSelStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction: 'all',
		mode: 'local',
		listeners:{
		'beforequery':function(combo,record,index){	
			var va_arr = new Array();
			var array =kmTypeBox.getValue().split(",")
			for(var o =0;o<array.length;o++){
				for(var i =0;i<kArr.length;i++){
					if(array[o]==kArr[i][0]){
						var temp = new Array()
						temp.push(kArr[i][0]);
						temp.push(kArr[i][1]);
						va_arr.push(temp);
					}
				}
			}
			kmSelStore.loadData(va_arr)
        },
        'select':function(combo,record,index){
        	var form = formPanel.getForm();
			var text =form.findField('formula').getValue();
			form.findField('formula').setValue(text+record.data.v)
        }
       },
		anchor:'95%'
	})

	var kmTypeStore = new Ext.data.SimpleStore({
	    id: 0,
		fields: ['val', 'txt']
	});
	kmTypeBox = new Ext.form.MultiSelect({
    	fieldLabel: '工资科目',
    	store: kmTypeStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: id,
		triggerAction: 'all',
		mode: 'local',
		allowBlank: false,
		editable :false,
		selectOnFocus:true,
		anchor:'95%'
    });
	db2Json.selectSimpleData("select zb_seqno,name from sgcc_guideline_info where parentid='005' order by zb_seqno",
		function(dat){
			kmTypeStore.loadData(eval(dat))
	});
	
	//选择账套使用的部门
	var deptStore = new Ext.data.SimpleStore({
		id : 0,
		fields : ['val','txt']
	});
	deptBox = new Ext.form.MultiSelect({
		fieldLabel:'使用部门',
		store:deptStore,
		displayField:'txt',
		valueField:'val',
		typeAhead:id,
		triggerAction:'all',
		mode:'local',
		allowBlank:false,
		editable:false,
		selectOnFocus:true,
		anchor:'95%'
	});
	var sql = "select t.unitid, t.unitname || '【' || (select u.unitname from sgcc_ini_unit u where u.unitid = t.upunit) || '】' patyname" 
		+ " from sgcc_ini_unit t where t.unit_type_id = '8' "
		+ " start with t.unitid = '"+USERBELONGUNITID+"' "
		+ " connect by PRIOR  t.unitid =  t.upunit";
	if(CURRENTAPPID == "1030902" || CURRENTAPPID == "1030903"){
		sql = "select t.unitid,t.unitname || '【' || (select u.unitname from sgcc_ini_unit u where u.unitid = t.upunit) || '】' patyname"
  		+ " from sgcc_ini_unit t where t.unit_type_id != '7' "
 		+ " and (t.unitid like '1030901%' or t.unitid like '1030902%' or t.unitid like '1030903%') "
 		+ " and(t.upunit like '1030901%' or t.upunit = '10309') "
 		+ " order by t.unitid asc";
	}
	db2Json.selectSimpleData(sql,function(dat){
		deptStore.loadData(eval(dat));
	});
	
	var Columns = [
		{name:'uids',type:'string'}     ,  {name:'code',type:'string'},     {name:'name',type:'string'},
		{name:'remark',type:'string'}   ,  {name:'items',type:'string'},    {name:'state',type:'string'},
		{name:'formula',type:'string'}	,
		{name:'deptid',type:'string'},{name:'pid',type:'string'}
	]	
	var formRecord = Ext.data.Record.create(Columns);

	//flbm_Combo.onTriggerClick = function (){newWin()}
    formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        autoScroll:true,
        region: 'center',
        labelWidth: 90,
        bodyStyle: 'padding:10px 10px;',
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                labelWidth: 70,
                layout: 'column',
                items:[
					new fm.TextField(fc['uids']),
                	{
	   					layout: 'form', columnWidth: .5,
	   					labelWidth: 70,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['code']),
	   						new fm.TextField(fc['name']),						
	   						state_com,
	   						kmTypeBox,
	   						deptBox
	   					]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					labelWidth: 70,
    					items:[
    					fc['remark']
    					]
    				}    				
    			]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
    			autoWidth:true,
                border:true, 
                labelWidth: 60,
                title:'计算公式',
                cls:'x-plain',  
                items: [{
                		layout: 'column',
		                border:false, 
		                cls:'x-plain',  
		                items: [{
				    			layout: 'form',
				    			columnWidth: .2,
				                border:false, 
				                labelWidth: 60,
				                cls:'x-plain',  
				                items: [kmSel_com]
		                	},{
				    			layout: 'form',
				                border:false, 
				                columnWidth: .2,
				                labelWidth: 40,
				                cls:'x-plain',  
				                items: [param_com]
		                	}, 
		                	{
				    			layout: 'form',
				                border:false, 
				                columnWidth: .1,
				                labelWidth: 40,
				                cls:'x-plain',  
				                items: [symbol_com]
		                	}
		                ]
                	},
		                	fc['formula']
    				
				]
    		})
    		
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
	
	
    var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar: ['<font color=#15428b><b>&nbsp;工资帐套维护</b></font>','->', 
				BUTTON_CONFIG['BACK']
		],
    	items: [formPanel]
    });
    
    viewport = new Ext.Viewport({
        layout:'border',
        items:[contentPanel]
    });
    
    window.setTimeout("initFormFun()");

	function formSave(){
    	var form = formPanel.getForm();
    	var value = form.findField('formula').getValue() 
    	var km =  kmTypeBox.getValue();
    	var flag = false;
    	if(uids!=""||uids!=null){
    		flag = true;
    	}
	    if(value==""||value==null||km==""){
	     	Ext.MessageBox.alert("提示","请填写完整数据!");
	     }else{
	     	//公式的有效性校验；
	     	FormulaUtil.getFormulaByText(value, function(rtn){
	     		if(rtn.indexOf("ITEM")==0) {
			     	doFormSave(rtn,flag);
	     		} else {
	     			Ext.Msg.alert("公式定义错误：", rtn );
	     		}
	     	});
	    }
	}

	function doFormSave(rtn,flag){
    	var form = formPanel.getForm()
    	var obj =new Object();
    	obj.uids = form.findField('uids').getValue()
		obj.name = form.findField('name').getValue();
		obj.code = form.findField('code').getValue();
		obj.state = form.findField('state').getValue();
		obj.remark = form.findField('remark').getValue();
		obj.items = kmTypeBox.getValue();
		obj.formula = rtn;
		obj.flag = flag;
		obj.deptid = ","+deptBox.getValue()+",";
		obj.pid = CURRENTAPPID;
		/*
    	var value = form.findField('formula').getValue(); 
    	var text_arr = value.split(";")
    	for(var i=0;i<text_arr.length;i++){
    		value=text_arr[i].replace(/([-.*+?^=;!:${}()|[\]\/\\])/g,"|");
    		var arr=value.split("|");
    		for(var k=0;k<arr.length;k++){
    				for(var j=0;j<paramArr.length;j++){   					
    					if(paramArr[j][1]!=""&&paramArr[j][1]==arr[k]){
  							var p=arr[k]+"";
  							var r=paramArr[j][0]+"";
  							text_arr[i]=text_arr[i].replace(p,r); 							
    					}
    				}
    				for(var q=0;q<kmArr.length;q++){
    					if(kmArr[q][1]!=""&&kmArr[q][1]==arr[k]){
    						var z=arr[k]+"";
    						var t=kmArr[q][0]+"";
    						text_arr[i]=text_arr[i].replace(z,t);
    					}
    				}
    			}
    	}
		obj.formula="";
		for(var o=0;o<text_arr.length;o++){
			if(text_arr[o]!=""||text_arr[o]!=null){
				if(o+1==text_arr.length){
				obj.formula+=text_arr[o];
				}
			else{
					obj.formula +=text_arr[o]+";"
					}
			}			
		}*/
		if(obj!=""&&obj!=null){
			rlzyXcglMgm.InsertTz(obj,function(dat){
				if(dat==true){
					Ext.MessageBox.alert("提示","数据保存成功!");
					history.back();
				}
				else{
					Ext.MessageBox.alert("错误","数据保存失败!");
				}
			})
		}
    } 
   	
   	
   	
});

function initFormFun(){
	if(flag==true){
		var edit_form = formPanel.getForm();
		edit_form.findField('uids').setValue(uids);
		edit_form.findField('name').setValue(name);
		edit_form.findField('code').setValue(code);
		edit_form.findField('state').setValue(state);
		edit_form.findField('remark').setValue(remark);
		deptBox.setValue(deptid);
		kmTypeBox.setValue(items);
		DWREngine.setAsync(false);
		FormulaUtil.getAccFormula(uids,function(s){
			formula = s
		})
		DWREngine.setAsync(true);
   		edit_form.findField('formula').setValue(formula)
   	}
}