<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>新增其他费用项目</title>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
	<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>
	
	<!-- EXT -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	
	<script type='text/javascript'>
		var parentItemId = "<%=request.getParameter("parentItemId")==null?"":request.getParameter("parentItemId")%>";
		var businessType = "<%=request.getParameter("businessType")==null?"":request.getParameter("businessType")%>";
		var sjType = "<%=request.getParameter("sjType")==null?"":request.getParameter("sjType")%>";
		var unitId = "<%=request.getParameter("unitId")==null?"":request.getParameter("unitId")%>";
		
		var fromM = "<%=request.getParameter("fromM")==null?"":request.getParameter("fromM")%>";
	</script>
  </head>
  <script type="text/javascript">
  	var bean = "com.sgepit.pmis.planMgm.hbm.PlanOtherCostItem";
  	var infoForm, itemCombo, newItemIdField, newItemNameField;
	var parentItemPath = "";
	var newItemId = "";
	var itemFilter = "";
	if(businessType && sjType && unitId) {
		var tableName = "";
		if (sjType.length==4) {
			tableName = "plan_year";
		} else if (sjType.length==5) {
			tableName = "plan_quarter";
		} else if (sjType.length==6) {
			tableName = "plan_month";
		}
		itemFilter = " and item_id not in (select bdg_id from " + tableName + " where sj_type='" + sjType + "' and business_type='" + businessType + "' and unit_id = '" + unitId + "')"
		itemFilter += " and pid='" + CURRENTAPPID + "'";
	}
  	
	Ext.onReady(function (){
		
		DWREngine.setAsync(false);
		investmentPlanService.getOtherCostFullPath(parentItemId, "0104", function(d){
			parentItemPath = d;
		});
		investmentPlanService.getCodeForNewItem(parentItemId, function(d1){
			newItemId = d1;
		});

		var itemStore = new Ext.data.SimpleStore({
			id: 0,
			fields : ['itemId','itemName']
		});
		
		var sql = "select item_id itemId, item_name itemName from plan_othercost_item t where t.parent_id = '" + parentItemId + "'" + itemFilter;
		db2Json.selectSimpleData(sql, function(dat){
			if(dat){
				itemStore.loadData(eval(dat))
			}
		});
	    itemCombo = new Ext.form.ComboBox({
	    	name: "itemName",
			fieldLabel: '项目名称',
			valueField: 'itemName',
			displayField: 'itemName', 
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: itemStore,
	        lazyRender: true,
	        allowBlank: false,
	        width : 300,
	        listClass: 'x-combo-list-small',
			anchor:'95%'
	    })
	    DWREngine.setAsync(true);
	    
		//维护其他项目费用
		var manageItemBtn = new Ext.Button({
			id: 'manage_item',
			text: '维护其他费用项目',
			tooltip: '维护其他费用项目',
			iconCls: 'btn',
			handler: function(){
				alert();
			}
		});
		
		var parentNodeField = new Ext.form.TextField({
			id : 'parentPath',
			fieldLabel : '父节点',
			allowBlank: false,
			disabled : true,
			anchor:'95%'
		});
		
		newItemIdField = new Ext.form.TextField({
			id : 'itemId',
			fieldLabel : '项目编号',
			allowBlank: false,
			disabled : true,
			anchor:'95%'
		});
		
		newItemNameField = new Ext.form.TextField({
			id : 'itemName',
			fieldLabel : '项目名称',
			allowBlank: false,
			anchor:'95%'
		});
		
		var remarkField = new Ext.form.TextArea({
			id : 'remark',
			fieldLabel : '备注',
			anchor:'95%'
		});
		
		infoForm = new Ext.FormPanel({
	        id: 'otherCost_item_form',
	    	labelWidth: 100,
	        frame:true,
	        region: 'center',
	        bodyBorder: true,
	        border: true,
	        bodyStyle:'padding:5px 5px 5px 5px',
	        width: 680,
	        height: 500,
			method : 'POST',
			url :  '',
	    	items: [
	    			new Ext.form.FieldSet({
		    			title: '项目基本信息',
		                border: true,
		                items:[
		                	parentNodeField,
		                	newItemIdField,
		                	newItemNameField,
		                	//itemCombo,
		                	remarkField
		    			]
	    			})
	    	],
			buttons: [{
				id: 'save',
	            text: '保存',
	            handler: formSave
	        /*
	        },{
				id: 'reset',
	            text: '重置',
	            handler: formResetFun
	        */
	        },{
				id: 'cancel',
	            text: '关闭',
	            handler: function(){
	            	window.close();
	            }
	        }]
        
    	});
    	
    	var panel = new Ext.Panel({
    		layout: 'border',
    		border: false,
    		region: 'center',
    		//tbar: [manageItemBtn],
    		items: [infoForm]
    	});

	   // 9. 创建viewport，加入面板action和content
	    var viewport = new Ext.Viewport({
	        layout: 'border',
	        border: false,
	        frame: false,
	        items: [panel]
	    });
	    
	    parentNodeField.setValue(parentItemPath);
	    newItemIdField.setValue(newItemId);
	    
	    itemCombo.on("select",function(obj,rec,inx){
		    newItemIdField.setValue(rec.get('itemId'));
	    });
	});
	
	function formResetFun() {
		newItemIdField.setValue(newItemId);
		itemCombo.setValue("");
	}
	
	function formSave(){
		var form = infoForm.getForm();
		if (form.isValid()){
			var data = form.getValues();
			data.itemId = newItemIdField.getValue();
			data.parentId = parentItemId;
			data.pid= CURRENTAPPID;
			var jsonData = Ext.encode(data);
			Ext.Ajax.request({
					waitMsg: '保存中......',
					method: 'POST',
					url : MAIN_SERVLET,
					params : {
								ac : "form-insert",
								id : data.itemId,
								bean : bean
							},
					xmlData : jsonData,			
					success:function(form,action){
				        var obj = Ext.util.JSON.decode(form.responseText);
				        if(obj.success==true) {
							var rtn = data.itemId + '`' + data.parentId + "`" + data.itemName;
							window.returnValue = rtn;
							window.close();
				        } else {
				            Ext.Msg.alert('提示',obj.msg);
				        } 
					},
				    failure:function(form,action){
				        Ext.Msg.alert('警告','系统错误');
				    }
			});
		}
	}  
	    
  </script>
</html>
