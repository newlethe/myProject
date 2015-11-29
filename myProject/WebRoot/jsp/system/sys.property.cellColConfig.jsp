<%@ page language="java" pageEncoding="UTF-8"%>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>报表数据项配置</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/comboBoxMultiSelect.css" />		
		<script type="text/javascript" src="<%=path%>/extExtend/MultiSelect.js"></script>	
		<script type="text/javascript" src="<%=path%>/dwr/engine.js"></script>
	    <script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/cellBean.js'></script>
	</head>
	<script type="text/javascript">
	var s = null;
	var selectPCode,selectPName,selectColCof,selectReportType,selectOrder
	if(parent.configMode == "insert"){
	
	}else if(parent.configMode == "edit"){
   		selectPCode = parent.selectPCode;
   		selectPName = parent.selectPName;
   		selectColCof = parent.selectColCof;
   		selectReportType = parent.selectReportType;
   		selectOrder = parent.selectOrder;
		s = selectColCof.split("/")
	}
	
	Ext.onReady(function (){
		DWREngine.setAsync(false);	
		colStore = new Ext.data.SimpleStore({
			id: 0,
			fields: ['val', 'txt', 'typ']
	    });
				
	    dateStore = new Ext.data.SimpleStore({
	    	id: 0,
	        fields: ['val', 'txt', 'typ']
	    });
		//时间下拉框	
		dateBox = new Ext.form.ComboBox({
	    	fieldLabel: '时&nbsp;&nbsp;&nbsp;间',
	    	width:150,
	    	height:300,
	    	maxHeight:300,
	    	store: dateStore,
	    	displayField:'txt',
			valueField:'val',
			typeAhead: id,
			triggerAction: 'all',
			mode: 'local',
			editable :false,
			allowBlank: false,
			selectOnFocus:true
	    });
		db2Json.selectSimpleData("select property_code,property_name,detail_type from property_code where type_name='REPORT_DATE' order by item_id",
		function(dat){
			dateStore.loadData(eval(dat))
			if(s && s.length>1) {
				dateBox.setValue(s[1].substring(0,2))
			}
		});
		dateBox.on('expand',function() {
			return true;
		})
		dateBox.on('select',function(c,r,i) {
			if(r.get('typ').length>1) {
				if(r.get('typ')=="YD"){
					mBox.show()
					dBox.show()
				}else if(r.get('typ') == "MD"){
					mBox.hide()
					dBox.show()
				}else{
					mBox.show()
					dBox.hide()
				}
				
			}
			else {
				mBox.hide()
				dBox.hide()
			}
		})
		mss = new Ext.data.SimpleStore({
	        fields: ['val', 'txt', 'typ'],
	        data : [ ['01','1月','MM'],['02','2月','MM'],['03','3月','MM'],['04','4月','MM'],['05','5月','MM'],['06','6月','MM'],
	        		['07','7月','MM'],['08','8月','MM'],['09','9月','MM'],['10','10月','MM'],['11','11月','MM'],['12','12月','MM'],
	        		['1Q','1季度','QQ'],['2Q','2季度','QQ'],['3Q','3季度','QQ'],['4Q','4季度','QQ'],
	        		['1H','上半年','YY'],['2H','下半年','YY'],
	        		['01','1月','YD'],['02','2月','YD'],['03','3月','YD'],['04','4月','YD'],['05','5月','YD'],['06','6月','YD'],
	        		['07','7月','YD'],['08','8月','YD'],['09','9月','YD'],['10','10月','YD'],['11','11月','YD'],['12','12月','YD'] ]
	    });
	    mBox = new Ext.form.ComboBox({
	    	hideLabel:true,
	    	width:60,
	    	maxHeight:200,
	    	hidden: true,
	    	store: mss,
	    	displayField:'txt',
			valueField:'val',
			typeAhead: id,
			triggerAction: 'all',
			mode: 'local',
			editable :false,
			selectOnFocus:true
	    });
	    
	    mBox.on('expand',function() {
			if(dateBox.getValue()!="") {
				var t = dateStore.getById(dateBox.getValue()).get('typ')
				mss.filterBy(function(d){
					if(d.get('typ')==t) {
						return true
					}
					else {
						return false
					}
				});
			}
		})
		mBox.on('hide',function (){
			mBox.setValue('')
	
			if(s && s.length>1 && s[1].length==4 && s[1].substr(0,2)=="81") {   //本月某天，只显示日期，不显示月份
			}else{
				dBox.setValue('')
				dBox.hide()
			}
			
		});
		
		mBox.on('select',function(c,r,i) {
			if(r.get('typ')=="YD") {
				dBox.show()
			}
			else {
				dBox.hide()
			}
		})
		/*
			针对日数据增加配置
		*/
		dss = new Ext.data.SimpleStore({
	        fields: ['val', 'txt', 'typ'],
	        data : [ ['01','1日','DD'] ,['02','2日','DD'] ,['03','3日','DD'] ,['04','4日','DD'] 
	        		,['05','5日','DD'] ,['06','6日','DD'] ,['07','7日','DD'] ,['08','8日','DD'] 
	        		,['09','9日','DD'] ,['10','10日','DD'] ,['11','11日','DD'] ,['12','12日','DD'] 
	        		,['13','13日','DD'] ,['14','14日','DD'] ,['15','15日','DD'] ,['16','16日','DD'] 
	        		,['17','17日','DD'] ,['18','18日','DD'] ,['19','19日','DD'] ,['20','20日','DD'] 
	        		,['21','21日','DD'] ,['22','22日','DD'] ,['23','23日','DD'] ,['24','24日','DD'] 
	        		,['25','25日','DD'] ,['26','26日','DD'] ,['27','27日','DD'] ,['28','28日','DD'] 
	        		,['29','29日','DD'] ,['30','30日','DD'] ,['31','31日','DD']]
	    });
	    dBox = new Ext.form.ComboBox({
	    	hideLabel:true,
	    	width:60,
	    	maxHeight:200,
	    	hidden: true,
	    	store: dss,
	    	displayField:'txt',
			valueField:'val',
			typeAhead: id,
			triggerAction: 'all',
			mode: 'local',
			editable :false,
			selectOnFocus:true
	    });
	    if(s && s.length>1 && s[1].length==4) {
	    	if(s[1].substr(0,2)=="81"){
	    		dBox.show()
		    	dBox.setValue(s[1].substring(2,4))
	    	}else{
		    	mBox.show()
		    	mBox.setValue(s[1].substring(2,4))
	    	}
	    	
	    }
	    
	    if(s && s.length>1 && s[1].length==6) {
	    	mBox.show()
		    mBox.setValue(s[1].substring(2,4))
	    	dBox.show()
	    	dBox.setValue(s[1].substring(4,6))
	    }
	    dBox.on('expand',function() {
	    
		})
		dBox.on('hide',function (){
			dBox.setValue('')
		});
		
		tabnameStore = new Ext.data.SimpleStore({
	    	id: 0,
	        fields: ['val', 'txt']
	    });
	    
	    tBox = new Ext.form.ComboBox({
			fieldLabel: '表',
			width: 450,
			maxHeight:400,
			store: tabnameStore,
			displayField:'txt',
			valueField : 'val',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable :false,
			allowBlank: false,
			selectOnFocus:true
		});
	    tBox.on('expand',function(combo){
			//Ext.getCmp('cnBox').reset()
	    })
	    tBox.on('change',function(t,n,o){
	    	db2Json.selectSimpleData("select column_name,column_name||'('||comments||')' from user_col_comments  where table_name = '"+n+"'",
			function(dat){
				cnameStore.loadData(eval(dat))
			});
			Ext.getCmp('cnBox').reset()
	    })
	    
	    db2Json.selectSimpleData("select table_name,table_name||'('||nvl(comments,'--')||')' from user_tab_comments  where table_name like 'ZM%' or table_name like 'B%' or table_name like 'KQ%' or table_name like 'HR%' or table_name like 'V_HR%' order by table_name",
		function(dat){
			tabnameStore.loadData(eval(dat))
		});
	    ///////////////////////////////////字段名 的combobox//////////////////////////
	    cnameStore = new Ext.data.SimpleStore({
	    	id: 0,
	        fields: ['val', 'txt']
	    });
	    
	    cnBox = new Ext.form.ComboBox({
	    	id:'cnBox',
			fieldLabel: '字段',
			width: 450,
			maxHeight:185,
			store: cnameStore,
			displayField:'txt',
			valueField : 'val',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable :false,
			allowBlank: false,
			selectOnFocus:true
		});
		configValueField = new Ext.form.TextField({
			name: "configValue",
	        fieldLabel: "数据项编号",
	        width:300,
	        allowBlank: false
		})
		configNameField = new Ext.form.TextField({
			name: "configName",
	        fieldLabel: "数据项名称",
	        width:300,
	        allowBlank: false
		})
		reportTypeStore = new Ext.data.SimpleStore({
	    	id: 0,
	        fields: ['val', 'txt']
	    });
		reportTypeBox = new Ext.form.MultiSelect({
	    	fieldLabel: '报表类型',
	    	width:500,
	    	maxHeight:200,
	    	store: reportTypeStore,
	    	displayField:'txt',
			valueField:'val',
			typeAhead: id,
			triggerAction: 'all',
			mode: 'local',
			allowBlank: false,
			editable :false,
			selectOnFocus:true
	    });
		db2Json.selectSimpleData("select property_code,property_name from property_code where type_name='REPORT_TYPE' order by item_id",
			function(dat){
				reportTypeStore.loadData(eval(dat))
		});
		itemIdFile = new Ext.form.NumberField({
			name: "itemId",
			fieldLabel: "排序号",
	        allowBlank: false,
	        width: 100 
		});
		formPanel = new Ext.form.FormPanel({
	        frame: true,
	        region: 'center',
	        //height:260,
			items:[itemIdFile,configValueField,configNameField,reportTypeBox,tBox,cnBox,
				{layout:'column',
				 border:false,
				 items:[{
				 	columnWidth:.6,
				 	layout:'form',
				 	border:false,
				 	items:dateBox
				 	},
				 	{
				 	columnWidth:.2,
				 	layout:'form',
				 	border:false,
				 	items:mBox
				 	},
				 	{
				 	columnWidth:.2,
				 	layout:'form',
				 	border:false,
				 	items:dBox
				 	}
				 ]
				},reportTypeBox],
	        buttons: [{text:'保存',handler:save},{text:'关闭',handler: closeWin}]
		});
		//viewport
		viewport = new Ext.Viewport({
			layout:'fit',
			items:[formPanel]
		});
		DWREngine.setAsync(true);	
		if(parent.configMode == "edit"){
			initEditData()
		}else{
			configValueField.setValue("CD_");
		}
	})
	function initEditData(){
		configValueField.setValue(selectPCode);
		configNameField.setValue(selectPName);
		reportTypeBox.setValue(selectReportType);
		itemIdFile.setValue(selectOrder)
		
		if(s[0].charAt(0) == '(' && s[0].charAt(s[0].length -1) == ')'){
			var ss = s[0].substr(1,s[0].length -2).split('.')
			tBox.setValue(ss[0])
			DWREngine.setAsync(false);	
			db2Json.selectSimpleData("select column_name,column_name||'('||comments||')' from user_col_comments where table_name = '"+ss[0]+"'",
				function(dat){
					cnameStore.loadData(eval(dat))
			});
			cnBox.setValue(ss[1])
			DWREngine.setAsync(true);	
		}
		
		configValueField.disable()
	}
	function save(){
		if(!formPanel.getForm().isValid()){
			alert("非空项必须填写数据")
			return;
		}
		var itemId = itemIdFile.getValue();
		var propertyCode = configValueField.getValue();
		var propertyName = configNameField.getValue();
		var tableName = tBox.getValue();
		var colName = cnBox.getValue();
		var reportType = reportTypeBox.getValue()
    	var date = dateBox.getValue() + "" + mBox.getValue() + "" + dBox.getValue();
    	var colConfg = "("+tableName+"."+colName+")"+"/"+date
    	
    	
    	cellBean.checkCellConfig(colConfg,parent.selectUids,function(dat){
    		if(dat){
    			alert("数据项重复，请检查")
    		}else{
    			if(parent.configMode == "insert"){
		    		cellBean.insertCellColConfig(propertyCode,propertyName,colConfg,reportType,itemId,function(dat){
		    			if(dat){
			    				alert("配置成功")
			    				parent.codeGridLoad()
			    				parent.cellColConfigWin.close();
			    				
			    			}else{
			    				alert("配置失败")
			    			}
	    			})
		    	}else if(parent.configMode = "edit"){
		    		cellBean.updateCellColConfig(parent.selectUids,propertyName,colConfg,reportType,itemId,function(dat){
		    			if(dat){
		    				alert("配置成功")
		    				parent.codeGridLoad()
		    				parent.cellColConfigWin.close();
		    			}else{
		    				alert("配置失败")
		    			}
		    		})
		    	}
    		}
    	})
    	
    	
		//alert(itemId+"|"+propertyCode+"|"+propertyName+"|"+tableName+"|"+colName+"|"+reportType+"|"+date)
	}
	function closeWin(){
		parent.cellColConfigWin.close();
	}
</script>
</html>
