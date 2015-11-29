<%@ page language="java" pageEncoding="UTF-8"%>
<!-- @author:lizp  -->
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>列配置</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>		    
	    <script type="text/javascript" src="<%=path%>/dwr/engine.js"></script>
	    <script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
	</head>
<body scroll=no>
</body>
</html>
<script>
var param = window.dialogArguments
var xlsOcx = param.xlsOcx
var s = null
//数据项/时间/列类型/排序类型/对齐方式/列格式

if(param.value!="") {
	s = param.value.split("/")
}
Ext.onReady(function(){
	var bd = Ext.getBody();
	// 数据项store
	var colStore = new Ext.data.SimpleStore({
		id: 0,
		fields: ['val', 'txt', 'typ','coltype']
    });
	// 时间store		
    var sjStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt', 'typ']
    });
    // 列类型store
    var coltypeStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt', 'typ']
    });
    // 下拉类型store
    var cosStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });

    var colBox = new Ext.form.ComboBox({
		fieldLabel: '数据项',
		width: 235,
		maxHeight:150,
		store: colStore,
		displayField:'txt',
		valueField : 'val',
		typeAhead: true,
		mode: 'local',
		triggerAction: 'all',
		editable :false,
		selectOnFocus:true
	});
	sql = "select code_table from sgprj_property_code where code_id='"+param.templet_type+"' and code_type='PROJECT_TYPE'"
	db2Json.selectSimpleData(sql,function(data){
//		var colSql = "select code_id,code_note,sj_tran,code_coltype from sgprj_property_code where code_type='PROJECT_COL' and (model_type='" + param.templet_type + "' or model_type is null) order by code_note";
		if(data!='[]'){
		var colSql = "select code_id,code_note,sj_tran,code_coltype from sgprj_property_code where code_type='PROJECT_COL' and (model_type='" + param.templet_type + "' or model_type is null) and (code_table is null or code_table='"+eval(data)[0]+"') order by code_note";
		db2Json.selectSimpleData(colSql,
			function(dat){
				colStore.loadData(eval(dat))
				if(s) {
					colBox.setValue(s[0])
				}
		});
		}
	})
    
	
	//判断类型
	colBox.on('select',function(a,b,c){
		var coltype = b.get('coltype')
		if(coltype.indexOf("VARCHAR2")>-1)  {
			if(coltypeBox.getValue()=="") {
				if(parseInt(coltype.substring(9,coltype.length-1))>100)  {
					coltypeBox.setValue("txt")
				} else {
					coltypeBox.setValue("ed")
				}
			}
			colsortBox.setValue("str")
			colalignBox.setValue("left")
		}
		if(coltype.indexOf("NUMBER")>-1)  {
			if(coltypeBox.getValue()=="") {
				coltypeBox.setValue("edn") 
			}
			colsortBox.setValue("int")
			colalignBox.setValue("center")
		}
		if(coltype=="DATE")  {
			if(coltypeBox.getValue()=="") {
				coltypeBox.setValue("calendar")
			} 
			colsortBox.setValue("date")
			colalignBox.setValue("center")
		}
		showformat()
	})
		
	var dateBox = new Ext.form.ComboBox({
    	fieldLabel: '时&nbsp;&nbsp;&nbsp;间',
    	width:92,
    	maxHeight:100,
    	store: sjStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: id,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
	db2Json.selectSimpleData("select code_id,code_note,sj_tran from sgprj_property_code where code_type='PROJECT_DATE' order by code_note",
	function(dat){
		sjStore.loadData(eval(dat))
		if(s && s.length>1) {
			dateBox.setValue(s[1])
		} else{
			dateBox.setValue('10')
		}
	});
	dateBox.on('expand',function() {
		if(colBox.getValue()!="") {
			var t = colStore.getById(colBox.getValue()).get('typ')
			sjStore.filterBy(function(d){
				if(d.get('typ').substring(0,1)==t) {
					return true
				}
				else {
					return false
				}
			});
		}
	})
	//下拉类型
    var cosBox = new Ext.form.ComboBox({
    	width:120,
    	maxHeight:100,
    	store: cosStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: id,
		hidden: true,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    db2Json.selectSimpleData("select code_id,code_note from sgprj_property_code where code_type='PROJECT_CO' order by order_id",
	function(dat){
		cosStore.loadData(eval(dat))
		if(s && s.length>2) {
			if(s[2].split("-").length>1) {
				cosBox.setValue(s[2].split("-")[1])
			}
		}
	});
	//列类型
    var coltypeBox = new Ext.form.ComboBox({
    	fieldLabel: '列类型',
    	emptyText: ' 自动 ',
    	width:100,
    	maxHeight:100,
    	allowBlank:false,
    	store: coltypeStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: id,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    db2Json.selectSimpleData("select code_id,code_note from sgprj_property_code where code_type='PROJECT_COLTYPE' order by order_id",
	function(dat){
		coltypeStore.loadData(eval(dat))
		if(s && s.length>2) {
			if(s[2].split("-").length>1) {
				coltypeBox.setValue(s[2].split("-")[0])
				cosBox.setValue(s[2].split("-")[1])
			} else {
				coltypeBox.setValue(s[2])
			}
			showformat() 
		}
		if(coltypeBox.getValue()=="co"||coltypeBox.getValue()=="coro")  {
			cosBox.show()
		} else  {
			cosBox.hide()
		}
	});
	coltypeBox.on('select',function(){showformat()})
	function showformat()  {
		if(coltypeBox.getValue()=="date"||coltypeBox.getValue()=="ron"||coltypeBox.getValue()=="edn") {
			colformatBox.enable()
		 } else {
		 	colformatBox.setValue("")
		 	colformatBox.disable()
		 }
		 if(coltypeBox.getValue()=="co"||coltypeBox.getValue()=="coro")  {
			cosBox.show()
		} else  {
			cosBox.hide()
		}
	}
	
	
	
	//列排序
	var colsortBox = new Ext.form.TextField({
    	fieldLabel: '列排序',
    	width:120
    });
    if(s &&s.length>3) {
		colsortBox.setValue(s[3])
	}
	
	//对齐方式
	var colalignBox = new Ext.form.TextField({
    	fieldLabel: '对齐方式',
    	width:120
    });
    
    if(s && s.length>4) {
		colalignBox.setValue(s[4])
	}
	
	//列格式
	var colformatBox = new Ext.form.TextField({
    	fieldLabel: '列格式',
    	disabled:true,
    	emptyText: '不控制格式',
    	width:120
    });
    if(s && s.length>5) {
		colformatBox.setValue(s[5])
	}

    var colPanel = new Ext.FormPanel({
		labelWidth: 75, 
		frame:true,
		title: '&nbsp;',
		bodyStyle:'padding:5px 5px 0',
		width: 340,
		height:250,
		items:[ colBox, {height:5}, 
				dateBox,
				{height:5},colsortBox,colalignBox,
				{layout:'column', border:false,items:[{columnWidth:.6,layout:'form',border:false,items:coltypeBox},{columnWidth:.4,layout:'fit',border:false,items:cosBox}]},
				{height:5},colformatBox, {height:5}],
		buttons: [{text:'确定',handler:submit},{text:'取消',handler:cancel}],
        buttonAlign:'center'
	});

    colPanel.render(document.body);
    
    function submit() {
    	var p1 = colBox.getValue()
    	var p2 = dateBox.getValue() 
    	var p3 = cosBox.getValue()==""?coltypeBox.getValue():coltypeBox.getValue()+"-"+cosBox.getValue()
    	var p4 = colsortBox.getValue()
    	var p5 = colalignBox.getValue()
    	var p6 = colformatBox.getValue()
		if(p1=="") {
    		alert("请选择数据项！")
    	}
    	else if(p2=="") {
    		alert("请选择时间！")
    	}
    	else {
    		var colStr = p1+"/"+p2+"/"+p3+"/"+p4+"/"+p5+"/"+p6
    		
    		if(xlsOcx.docType =="2"){
				cell = xlsOcx.ActiveDocument.Application.Selection.Areas(1).Cells(1);				
				if(!cell.Comment) {
					cell.AddComment();
				}
				cell.Comment.text(colStr);  
			} 
    		//Wps电子表格
			if(xlsOcx.docType =="7"){
				cell = xlsOcx.ActiveDocument.Application.Selection
				var adress = cell.Address;
				if(adress.split(":").length ==2){
					adress = adress.split(":")[0]
				}
				if(cell.Commented) {					
					xlsOcx.ActiveDocument.Application.Range(adress).AddComment(colStr);
					//cellcommit= xlsOcx.ActiveDocument.Application.Range(adress).Comment.Text
				} else{
					xlsOcx.ActiveDocument.Application.Range(adress).AddComment(colStr);
				}
			}
    		
    		
			/*var cell = xlsOcx.ActiveDocument.Application.Selection.Areas(1).Cells(1);
			if(!cell.Comment) {
				cell.AddComment();
			}
			cell.Comment.text(colStr);    */
			window.close()	
    	}
    }
    
    function cancel() {
		window.close()
    }
});
</script>