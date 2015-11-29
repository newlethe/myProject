var container,formPanel,gridPanel,saveFormBtn
var servletUrl = CONTEXT_PATH + "/servlet/MatServlet";
var ServletActionName = "getArriveMatByID"
var ServletSaveActionName = "saveArriveMat"

var form
var listMethod = "getArriveApply";
var whereCondition ="jhbh='" + cgbh + "' and bm='" + bm + "'";
var primaryKey ="uids"
var orderCol ="xqrq"
var btnText = "申请入库";

if(cgbh != "计划外"){
	if (billType=="到货"){
		btnText = "确认分摊并申请入库" ;
	} else{
		btnText = "确认分摊";
	}
} 



Ext.onReady(function (){       
	Ext.apply(Ext.QuickTips.getQuickTip(), {
		titleCollapse:true
	});
	var fm = Ext.form;
    var wzInputRec = Ext.data.Record.create([
       	{name: 'uids'},     
       	{name: 'bm'},   
       	{name: 'pm'},   
       	{name: 'gg'},     
       	{name: 'dw'}, 	    
	    {name: 'sjdj',type: 'float'},	
	    {name: 'sv',type: 'float'},	
	    {name: 'sqsl',type: 'float'},	
	    {name: 'zjbh'},
	    {name: 'cgbh'},
	    {name: 'pbbh'},
	    {name: 'billState'},
	    {name: 'billType'}
	]);
	
	formPanel = new fm.FormPanel({       
        title:'入库填写信息',
        frame: true,
        id: 'form-panel',
        header: false,
        border: false,
        autoScroll:true,
        region: 'center',
        split:true,
        labelWidth: 60,
        autoHeight:true,
        bodyStyle: 'padding:10px 10px;',
    	labelAlign: 'left',
        
        reader : new Ext.data.JsonReader({
		    totalProperty: "results",
		    root: "rows",
		    id: "uids"
		}, wzInputRec),		
		items:[{
            xtype:'fieldset',
            hidden: true,
            title: '隐藏字段',
            autoHeight:true,
            defaults: {width: 250},          
            items :[{
            	xtype:'textfield', 
            	fieldLabel: '主键',
            	id: 'uids',
            	name: 'uids'
            },{
            	xtype:'textfield', 
            	fieldLabel: '采购编号',
            	id: 'cgbh',
            	name: 'cgbh'
            },{
            	xtype:'textfield', 
            	fieldLabel: '到货编号',
            	id: 'pbbh',
            	name: 'pbbh'
            },{
           		xtype:'textfield', 
            	fieldLabel: '合同号',
            	id: 'hth',
            	name: 'hth',
            	value:hth
            }]
        },{
            xtype:'fieldset',
            autoHeight:true,
            title:"物资信息",
            layout: 'column',            		
           	items :[
            {
            	columnWidth:.7,
            	bodyStyle: 'border: 0px;',
                layout: 'form',
            	items: [{
					xtype:'textfield',
					id: 'pm',
					name: 'pm',
					fieldLabel: '品名',			
					anchor:'95%',
		            readOnly:true
				},{           
		            xtype:'textfield',
		            fieldLabel: "规格",   
		            id: 'gg',                 
		            name: 'gg',
		            anchor:'95%' ,
		            readOnly:true      
		        }]
            },{
            	columnWidth:.3,
            	bodyStyle: 'border: 0px;',
                layout: 'form',
            	items: [{
		        	xtype:'textfield',
		        	id: "bm",
		            fieldLabel : "编码",                    
		            name: 'bm',
		            anchor:'95%',
		            readOnly:true
				},{
		        	xtype:'textfield',
		            fieldLabel : "单位",     
		            id: "dw",               
		            name: 'dw',
		            anchor:'95%',
		            readOnly:true
				}]
            }]           		
        },{
            xtype:'fieldset',
            autoHeight:true,
            title:"本次到货信息",
            defaults: {width: 250},    
            layout: 'column',            		
           	items :[{
            	columnWidth:.25,
            	bodyStyle: 'border: 0px;',
                layout: 'form',
            	items: [{
					xtype:'textfield',  
					fieldLabel: '<font color="red">发票号</font>', 
					readOnly: (billState=="N"?false:true),
					id: 'zjbh',
					name: 'zjbh',
					anchor:'95%'
				}]
            },{
            	columnWidth:.25,
            	bodyStyle: 'border: 0px;',
                layout: 'form',
            	items: [{
					xtype:'numberfield',  
					fieldLabel: '<font color="red">含税单价</font>', 
					id: 'sjdj',
					name: 'sjdj',
					readOnly: (billState=="N"?false:true),
					anchor:'95%'
				}]
            },{
            	columnWidth:.25,
            	bodyStyle: 'border: 0px;',
                layout: 'form',
            	items: [{
					xtype:'numberfield', 
					fieldLabel: '<font color="red">税率</font>', 
					readOnly: (billState=="N"?false:true),
					id: 'sv',
					name: 'sv',
					anchor:'95%'
				}]
            },{
            	columnWidth:.25,
            	bodyStyle: 'border: 0px;',
                layout: 'form',
                items: [{
                	xtype:'numberfield', 
                	fieldLabel: '<font color="red">本次到货</font>',
                	readOnly: (billState=="N"?false:true),
                	name: 'sqsl',
		            anchor:'95%'
                }]
            }]           		
        }],
        buttons: [{
			id: 'saveForm',
			text: btnText ,
			hidden: (billState=="N"?false:true),
			hiddenMode:'visibility',
			handler: onItemClick
		},{
			id: 'closeForm',
			text: '关闭',
			hiddenMode:'visibility',
			handler: onItemClick
		}]
    });	
	/* (2) */
	var fc = {		// 创建编辑域配置
    	'uids': {
			name: 'uids',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true
        }, 'bh': {
			name: 'bh',
			fieldLabel: '申请计划编号',
			allowBlank: false,
			anchor:'95%'
        }, 'bm': {
			name: 'bm',
			fieldLabel: '编码',
			allowBlank: false,
			anchor:'95%'
		}, 'pm': {
			name: 'pm',
			fieldLabel: '品名',			
			anchor:'95%'
		}, 'gg': {
			name: 'gg',
			fieldLabel: '规格',		
			anchor:'95%'
		}, 'dw': {
			name: 'dw',
			fieldLabel: '单位',		
			anchor:'95%'
		}, 'bmmc': {
			name: 'bmmc',
			fieldLabel: '申请部门',		
			anchor:'95%'
		}, 'sl': {
			name: 'sl',
			fieldLabel: '申请数量',		
			anchor:'95%'
		}, 'curDhsl': {
			name: 'curDhsl',
			fieldLabel: '<font color="red">本次分摊数量</font>',		
			anchor:'95%'
		}, 'ftsl': {
			name: 'ftsl',
			fieldLabel: '已分摊量',		
			anchor:'95%'
		}, 'xqrq': {
			name: 'xqrq',
			fieldLabel: '需求日期',		
			anchor:'95%'
		}
		
	};
	var sm =  new Ext.grid.RowSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([{
	       id: 'uids',
	       align: 'center',
	       header: fc['uids'].fieldLabel,
	       dataIndex: fc['uids'].name,
	       width: 150,
	       align: 'center',
	       hidden:true,
	       readOnly: true
	    },{
	       id:	'bh',
	       header: fc['bh'].fieldLabel,
	       dataIndex: fc['bh'].name,
	       width: 70,
	       align: 'center',
	       readOnly: true
	    },{
	       id:	'bm',
	       header: fc['bm'].fieldLabel,
	       dataIndex: fc['bm'].name,
	       width: 70,
	       hidden:true,
	       align: 'center'
	    },{
	       id:	"sl",
	       header: fc['sl'].fieldLabel,
	       dataIndex: fc['sl'].name,
	       width: 70,
	       align: 'center',
	       readOnly: true
	    },{
	       id:	"curDhsl",
	       header: fc['curDhsl'].fieldLabel,
	       dataIndex: fc['curDhsl'].name,
	       width: 70,
	       align: 'center',
	       editor: new fm.NumberField(fc['curDhsl'])
	    },{
	       id:	"ftsl",
	       header: fc['ftsl'].fieldLabel,
	       dataIndex: fc['ftsl'].name,
	       width: 70,
	       align: 'center',
	       readOnly: true
	    },{
	       id:	"bmmc",
	       header: fc['bmmc'].fieldLabel,
	       dataIndex: fc['bmmc'].name,
	       width: 70,
	       align: 'center',
	       readOnly: true
	    },{
	       id:'xqrq',	
	       header: fc['xqrq'].fieldLabel,
	       dataIndex: fc['xqrq'].name,
	       align: 'center',
	       renderer:formatDate,
	       width: 95
	    }
    ]);
    cm.defaultSortable = true;	
    Plant = Ext.data.Record.create([
	    {name: 'uids',type:'string'},
	    {name: 'bh', type: 'string'},	
	    {name: 'bm', type: 'string'},	    
	    {name: 'bmmc', type: 'string'},
	    {name: 'ftsl', type: 'float'},
	    {name: 'curDhsl', type: 'float'},
	    {name: 'sl', type: 'float'},
	    {name: 'xqrq', type: 'date', dateFormat: 'Y-m-d H:m:s'}
    ]);
    PlantInt = {
    	uid: '',
    	bh: '',
    	curDhsl:'',
    	bm: ''
    };
    store = new Ext.data.Store({
        baseParams:{
        	ac: 'getArriveApply',				//表示取列表
	    	whereStr: whereCondition,
	    	arriveBh: arriveBh,
	    	sort: orderCol
        },
       proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: servletUrl
        }),
        reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : 'uids'
		}, Plant),

        sortInfo:{field:'xqrq', direction:'ASC'}
    });
    gridPanel = new Ext.grid.EditorGridTbarPanel({
    	region: 'south',
   		id: "process-grid-panel",
   		//collapsible : true,
		//animCollapse : true,
		//autoExpandColumn : 2,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},	    
        ds: store,
        cm: cm,
        sm: sm,
        height:450,
        title:'到货分摊--申请计划',
        border:false,
        clicksToEdit:1,
        addBtn: false,
        saveBtn: false,
        delBtn: false,
        tbar: [],
        iconCls: 'icon-by-category',
        plant: Plant,				
      	plantInt: PlantInt,	      	
      	sort: orderCol,			
      	primarykey: primaryKey,
      	servletUrl: servletUrl
    });

	/* (3) */
	container = new Ext.Panel({
		region:'center',
		layout:'border',
        items:[gridPanel,formPanel]
		        
	});
	
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[container]
	});
	viewport.doLayout();
	if(cgbh=="计划外"){
		gridPanel.hide()
	}

	saveFormBtn = Ext.getCmp('saveForm') 

	form = formPanel.getForm()

	form.load({url: servletUrl, params:{ac:ServletActionName,uids:uids}, waitMsg:'Loading'});

	store.load();	
	
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
  
});

	
function onItemClick(item) {
	switch(item.id) {
		case 'saveForm':
			saveForm(false);
			break;		
		case 'closeForm':
			closeForm()
			break;	
	}
}

function saveForm(valueMonthod){
	var form = formPanel.getForm();	
	
	var data = form.getValues()		
	var jsonData = Ext.encode(data);	
	var dhslSum = form.findField("sqsl").getValue()
	var obj = getGridJsonData();
	if(cgbh != "计划外"){	
		if(obj.dhsl*1 ==0){
			Ext.Msg.alert("提示", "请填写分摊数量！");
			return;
		}
		if(obj.dhsl*1 > dhslSum*1){
			//Ext.Msg.alert("提示", "申请计划的本次分摊数量之和 与 本次到货总数量不等，请重新分摊！");
			Ext.Msg.alert("提示", "申请计划的本次分摊数量之和 不能大于 本次到货总数量，请重新分摊！");
			return;
		}
	}
	//obj.jsonArray.push(jsonData)
	var jsonDataGrid = "["+obj.jsonArray.join(",")+"]";
	var jsonDataGridAndForm = jsonDataGrid + "``" + jsonData
	Ext.Ajax.request({
		waitMsg : 'Saving changes...',
		url : servletUrl,
		params : {
			ac : "saveArriveMat"
		},
		method : "POST",
		xmlData : jsonDataGridAndForm,
		success : function(response, params) {
			var rtn = Ext.decode(response.responseText);
			if (rtn.success){
				flag--;
				window.returnValue = flag
				var tip = Ext.QuickTips.getQuickTip();

				tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + btnText+ '成功!', 'icon-success')
				//Ext.MessageBox.alert("提示","保存成功!")				
				tip.show();
				store.load();
				
			} else {
				Ext.MessageBox.alert("提示",rtn.msg)
				var tip = Ext.QuickTips.getQuickTip()
				tip.setTitle("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+rtn.msg, 'icon-failure')
				tip.show();
			}
		},
		failure : function(response, params) {
			//Ext.MessageBox.alert("提示",response.responseText)
			var tip = Ext.QuickTips.getQuickTip()
			tip.setTitle("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+response.responseText, 'icon-failure')
			tip.show();
		}
	});

}	
	
		
	

function closeForm(){
	window.close();
}

function getGridJsonData(){
	var countRec = store.getTotalCount()
	var dhsl = 0;
	var jsonArray = new Array();
	for (var index=0;index<countRec;index++){
		var rec = store.getAt(index)
		var dhsl = dhsl + (rec.get("curDhsl")==null?0: rec.get("curDhsl")*1) 
		jsonArray.push(Ext.encode(rec.data))
	}
	var obj = new Object();
	obj.dhsl = dhsl;
	obj.jsonArray = jsonArray;
	return obj;
	
}


function showPrevious(button){
	/*if(mygridType=="xgrid"){
	 	var currentNumber = mygrid.getRowIndex(mygrid.getSelectedRowId()) //当前行号 0..count-1
	 	var preNumber = currentNumber  == 0 ? -1 : currentNumber-1; //上一行的行号，如果大于count 则返回-1
	 	if(currentNumber == 1){
	 		button.disable() 
	 	}
	 	if(preNumber != -1){
	 		var id = mygrid.getRowId(preNumber)
	 		refreshForm(id)

	 		mygrid.selectRowById(id)
	 		var b = Ext.getCmp('nextbtn')
	 		b.enable() 
	 	}else{
	 		alert('已到第一行')
	 	}
	} else if(mygridType =="extgrid"){
		var sm = mygrid.getSelectionModel()
		if(sm.hasPrevious()){			
			sm.selectPrevious()
			refreshForm(sm.getSelected().get("projectId"))
		} else{
			alert('已到第一行')
		}
		
	}*/
}
function showNext(button){
	/*if(mygridType=="xgrid"){
		var count = mygrid.getRowsNum() //总行数
	 	var currentNumber = mygrid.getRowIndex(mygrid.getSelectedRowId()) //当前行号 0..count-1
	 	var nextNumber = currentNumber+2 > count ? -1 : currentNumber+1; //下一行的行号，如果大于count 则返回-1
	
	 	if(currentNumber == count-2){
	 		button.disable() 
	 	}
	 	if(nextNumber != -1){
	 		var id = mygrid.getRowId(nextNumber) 		
	 		refreshForm(id)
	
	 		mygrid.selectRowById(id) 		
	 	    var b = Ext.getCmp('prebtn')
	 		b.enable() 
	 		
	 	}else{
	 		alert('已到最后一行')
	 	}
	}else if(mygridType =="extgrid"){
		var sm = mygrid.getSelectionModel()
		if(sm.hasNext()){			
			sm.selectNext()
			refreshForm(sm.getSelected().get("projectId"))
		}else{
	 		alert('已到最后一行')
	 	}
		
		
	}*/
 }
function checkDisable(){

    Ext.getCmp('prebtn').enable() 
    Ext.getCmp('nextbtn').enable() 
	var current = mygrid.getRowIndex(mygrid.getSelectedRowId())
	var count = mygrid.getRowsNum()
	if(current == 0){
		Ext.getCmp('prebtn').disable() 
	}
	if(current == count-1){
	 	Ext.getCmp('nextbtn').disable() 
	}
}

function refreshForm(rowid){

	if(args.ac == "update" || args.ac == "insert" ){
		saveForm(true)
	}
	uids = rowid	
	form.load({url: servletUrl, params:{ac:ServletActionName,uids: rowid}, waitMsg:'Loading'});
	
}