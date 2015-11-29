<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>报表录入招投标数据</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
	</head>
<script type="text/javascript">
var param =	window.dialogArguments;
var m_record = param.m_record;
var addType = param.addType;
var editZbSeqno = param.editZbSeqno;

var addFlag = false;
window.onbeforeunload = closeForm;
var formPanel, addWin;

Ext.onReady(function() {
	
	var BUTTON_CONFIG = {
    	'SAVE': {
			id: 'save',
	        text: '保存',
	        handler: formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        handler: function(){
	        	window.close();
	        }
	    }
    };
	 
	formPanel = new Ext.FormPanel({
		id : 'form-panel',
		height : 400,
		labelAlign : 'left',	
		region: 'center',
		frame : true,
		tbar:['->',{xtype:'label',text:'计量单位：万元 '}],
		bodyStyle : 'padding:5px 5px 5px 5px',
    	items: [
    		 new Ext.form.FieldSet({
    			 title : '招投标明细信息',
				layout : 'column',
				labelWidth : 120,
                items:[{
   					layout: 'form', 
   					columnWidth: .5,
   					bodyStyle: 'border: 0px;',
   					items:[ 
	   					{
	   						name: 'zbnr',
							fieldLabel: '标的<font color=\'red\'>*</font>',
							xtype: 'textfield',
							allowBlank : false,
							anchor:'95%'
	   					},{
	   						name: 'kbrq',
							fieldLabel: '开标日期<font color=\'red\'>*</font>',
							format : 'Y-m-d',
							xtype: 'datefield',
							allowBlank : false,
							anchor:'95%'
	   					},{
	   						name: 'pbbf',
							fieldLabel: '评标办法<font color=\'red\'>*</font>',
							xtype: 'textfield',
							allowBlank : false,
							anchor:'95%'
							
	   					},{
	   						name: 'zbdw',
							fieldLabel: '中标单位<font color=\'red\'>*</font>',
							xtype: 'textfield',
							allowBlank : false,
							anchor:'95%'
		   					},{
	   						name: 'kbjg',
							fieldLabel: '开标价格<font color=\'red\'>*</font>',
							xtype: 'numberfield',
							allowBlank : false,
							anchor:'95%'
	   					},{
	   						name: 'convalue',
							fieldLabel: '合同价格',
							xtype: 'numberfield',
							anchor:'95%'
	   					},{
	   						name: 'memo',
							fieldLabel: '备注<font color=\'red\'>*</font>',
							xtype: 'textarea',
							allowBlank : false,
							anchor:'95%'
	   					}
    				]
    			},{
    					layout: 'form', 
    					columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    			           {
    			        	   	name: 'zbbh',
								fieldLabel: '招标编号<font color=\'red\'>*</font>',
								xtype: 'textfield',
								allowBlank : false,
								anchor:'95%'
	   						},{
		   						name: 'zbfs',
								fieldLabel: '招标方式<font color=\'red\'>*</font>',
								xtype: 'textfield',
								allowBlank : false,
								anchor:'95%'
		   					},{
	   						    name: 'dljg',
							    fieldLabel: '代理机构名称<font color=\'red\'>*</font>',
							    xtype: 'textfield',
							    allowBlank : false,
							    anchor:'95%'
	   					    },{},{},{
		   						name: 'zbjg',
								fieldLabel: '中标价格<font color=\'red\'>*</font>',
								xtype: 'numberfield',
								allowBlank : false,
								anchor:'95%'
		   					},{
		   						name: 'bdgValue',
								fieldLabel: '执行概算价格<font color=\'red\'>*</font>',
								xtype: 'numberfield',
								allowBlank : false,
								anchor:'95%'
		   					},
		   					new Ext.form.Hidden({
		   						name: 'uids',
								fieldLabel: '系统编号',
								xtype: 'textfield',
								hidden: true,
								anchor:'95%'
		   					}),
		   					new Ext.form.Hidden({
		   						name: 'zbSeqno',
								fieldLabel: '指标编号',
								xtype: 'textfield',
								hidden: true,
								anchor:'95%'
		   					})
		   				]
    				} 
    			]
    		})
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [formPanel]
	});
	
	if(addType == "edit") {
		DWREngine.setAsync(false);
		PCBidDWR.getZbNr2Report(m_record.get("sjType"), m_record.get("pid"), editZbSeqno, function(dat){
			var editRec = new Ext.data.Record(dat);
			formPanel.getForm().loadRecord(editRec);
		});
		DWREngine.setAsync(true);
	}
});


function formSave(){
	var form = formPanel.getForm()
	if (form.isValid()){
	    var obj = form.getValues()
		obj.unitId = m_record.get("pid")
		obj.sjType = m_record.get("sjType")
		obj.unitname = CURRENTAPPNAME;
	    
	   	DWREngine.setAsync(false);
		PCBidDWR.insertZbNr2Report(obj, function(state){
			if ("" == state){
				addFlag = true;
				Ext.example.msg('保存成功！', '您成功保存了一条信息！');
				Ext.Msg.show({
				   title: '提示',
				   msg: '是否继续新增?',
				   buttons: Ext.Msg.YESNO,
				   fn: resetForm,
				   icon: Ext.MessageBox.QUESTION
				});
	 		}else{
	 			Ext.Msg.show({
					title: '提示',
					msg: state,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
	 		}
	 	});
		DWREngine.setAsync(true);
	}
}

function resetForm(buttonId, text){
	if(buttonId=="yes") {
		formPanel.getForm().reset();
	} else {
		window.close();
	}
}

function closeForm() {
	if(addFlag) {
		try {
			param.onWinClosed();
		}catch(e){
		}
	}
}

</script>
</html>