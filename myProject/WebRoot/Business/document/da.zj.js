var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.document.hbm.DaZl"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "daid"
var orderColumn = "dh"
var gridPanelTitle ="案卷列表"
var formPanelTitle = "档案组卷"
var pageSize = PAGE_SIZE;
var SPLITB = "`"
var treeData = new Array();
var BillState = new Array();
var databzdw=new Array();
var datazy=new Array();
var damj=new Array();
var treePanel
var data;
var win;
var viewport;
var formWindow;
var partBs = new Array();
var bjhdStr = new Array();
var dhArr = new Array();
var uploadWin
var formPanel
var propertyName = "indexid";
var selectedTreeData = "";
var selectedTreeDataIndexid ="";
var rootText = "档案分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var formWin;
var selectorgid;
var flag = true;
var dazjWin;
var operate;
var bb=true;
var ss=true;
var currentPid = CURRENTAPPID;
var reportArgs1 = new Object();
var indexidStr = new Array();
var ds_pid=" pid='"+currentPid+"' and ";
var strs = '';
var selectedBM = ''
var daids="";
Ext.onReady(function() {
	 DWREngine.setAsync(false);
	 baseMgm.getData("select indexid,mc from da_tree",function(list){
	    if(list.length>0){
	       for(var i=0;i<list.length;i++){
	          var temp = new Array();
	          temp.push(list[i][0]);
	          temp.push(list[i][1]);
	          indexidStr.push(temp);
	       }
	    }
	})
	DWREngine.setAsync(true);
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "daTree",
			businessName : "zldaMgm",
			pid:currentPid,
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'da-tree-panel',
		region : 'west',
		split : true,
		width : 260,
		minSize : 175,
		maxSize : 300,
		frame : false,
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : false,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		columns : [{
			header : '档案名称',
			width : 400,
			dataIndex : 'mc'
		}, {
            header: '主键',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";  }
        },{
            header: '编码',
            width: 0,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";  }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '系统自动存储编码',
            width: 0,
            dataIndex: 'indexid',
            renderer: function(value){
            	return "<div id='indexid'>"+value+"</div>";
            }
        },{
            header: '部门id',
            width: 0,
            dataIndex: 'orgid',
            renderer: function(value){
            	return "<div id='orgid'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        }],
		loader : treeLoader,
		root : root
	});

	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.treeid;
		if (parent == null)
			parent = 'root';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;

		})

	var btnReturn = new Ext.Button({
		text : '返回',
		tooltip : '返回',
		iconCls : 'returnTo',
		handler : function() {
			history.back();
		}
	});

	var update = new Ext.Button({
		id : 'update',
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : updatedept
	});
	var btnDaQuery=new Ext.Button({
		id : 'DaQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler : QueryDaWinwdow
	});
	var dazl = new Ext.Button({
		id : 'dazl',
		text : '档案组卷',
		tooltip : '档案组卷',
		iconCls : 'btn',
		handler : dazlwin
	});
	
	function PrintQymlWinwdow() {
		 if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
		var record = sm.getSelected();
		var daid = record.get('daid');
		with(document.all.dbnetcell0){
			code = "qyml"						//模块编号
			report_no = "qyml"		//报表编号
			ss=false;
			reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
			onReportOpened = "reportOpened"
			reportArgs.dah = daid//报表参数的值   bc 是参数名称
			readOnly = true	//可选，报表是否可以保存，默认为false
			open()					//调用open方法打开报表，返回流水号
		}
	}
	
	function PrintfnmlWinwdow() {
	    var records = collectionToRecords();
		if(records == null || records == ""  || records.length == 0){
		    Ext.example.msg('系统提示！', '请选择您要打印的记录');
		    return;
		}
        var str="";
		for (var i = records.length-1; i >=0; i--) {
			  if(records.length == 1){
				  str +=records[i].data.daid
				  break;
				}
				if(i == records.length-1){
				    str +=""+records[i].data.daid+"',";
				}
				if(i == 0){
				    str +="'"+records[i].data.daid+"";
				}
				if(i>0&&i<records.length-1){
				   str +="'"+records[i].data.daid+"',";
				}
		}
		with(document.all.dbnetcell0){
			code = "daflml"						//模块编号
			report_no = "daflml"		//报表编号
			reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
			onReportOpened = "reportOpened1"			
			reportArgs.dafn =str//报表参数的值   bc 是参数名称
			reportArgs1.dafn =str//报表参数的值   bc 是参数名称
			readOnly = true		//可选，报表是否可以保存，默认为false
			open()					//调用open方法打开报表，返回流水号
		}
		var hd_checker = Ext.getCmp("grid-panel").getEl().select('div.x-grid3-hd-checker');
		var hd = hd_checker.first();   
		//清空表格头的checkBox    
		if(hd.hasClass('x-grid3-hd-checker-on')){  
		   hd.removeClass('x-grid3-hd-checker-on');  
		 }  
		sm.clearSelections(); 
	}	
	
	function PrintFmWinwdow() {
		 if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
		var record = sm.getSelected();
		var daid = record.get('daid');
		with(document.all.dbnetcell0){
			code = "dafm"						//模块编号
			report_no = "dafm"		//报表编号
			reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
			reportArgs.dah = daid//报表参数的值   bc 是参数名称
			readOnly = true					//可选，报表是否可以保存，默认为false
			open()					//调用open方法打开报表，返回流水号
		}
	}
	function PrintJNBKBWinwdow() {
		  if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	 	 var record = sm.getSelected();
		 var daid = record.get('daid');
		 with(document.all.dbnetcell0){
			code = "jnbkb"						//模块编号
			report_no = "jnbkb"		//报表编号
			reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
			reportArgs.dah = daid//报表参数的值   bc 是参数名称
			readOnly = true					//可选，报表是否可以保存，默认为false
			open()					//调用open方法打开报表，返回流水号
		}
	}
	//打印案卷目录
	function PrintAjmlWinwdow() {
		 with(document.all.dbnetcell0){
			code = "ajml"						//模块编号
			report_no = "ajml"		//报表编号
			reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
			//reportArgs.dah = daid//报表参数的值   bc 是参数名称
			readOnly = true					//可选，报表是否可以保存，默认为false
			open()					//调用open方法打开报表，返回流水号
		}
	}
	//
	function PrintMLWinwdow() {
		  if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
		 var record = sm.getSelected();
		 var daid = record.get('daid');
		 with(document.all.dbnetcell0){
			code = "jnml"						//模块编号
			report_no = "jnml"		//报表编号
			ss=false;
			reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
			onReportOpened = "reportOpened";//报表打开时事件，执行sql查询，放入数据
			reportArgs.dah = daid//报表参数的值   bc 是参数名称
			readOnly = true					//可选，报表是否可以保存，默认为false
			open()					//调用open方法打开报表，返回流水号
		}
	}
	//案卷移交目录
	function PrintyjmlWinwdow() {
		daids = "";
		var records = collectionToRecords();
		if(records == null || records == ""  || records.length == 0){
		    Ext.example.msg('系统提示！', '请选择您要打印的记录');
		    return;
		}
		for (var i = records.length-1; i >=0; i--) {
			  if(records.length == 1){
				  daids +=records[i].data.daid
				  break;
				}
				if(i == records.length-1){
				    daids +=""+records[i].data.daid+"',";
				}
				if(i == 0){
				    daids +="'"+records[i].data.daid+"";
				}
				if(i>0&&i<records.length-1){
				   daids +="'"+records[i].data.daid+"',";
				}
		}
		 //var daid = record.get('daid');
		 with(document.all.dbnetcell0){
			code = "anjyj"						//模块编号
			report_no = "anjyj"		//报表编号
			ss=false;
			reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
			onReportOpened = "reportOpened2"//报表打开时事件，执行sql查询，放入数据
			reportArgs.dah = daids//报表参数的值   bc 是参数名称
			readOnly = true		
			open()					//调用open方法打开报表，返回流水号
		}
		sm.clearSelections(); 
	}
	//1.5cm
	function PrintBJWinwdow(){
		 if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=6) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj"						//模块编号
				report_no = "dabj"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				if(ids[0]!=null){
				  reportArgs.dah1 = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah1 =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				if(ids[2]!=null){
				  reportArgs.dah3 = ids[2]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah3 =""
				}
				if(ids[3]!=null){
				  reportArgs.dah4 = ids[3]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah4 =""
				}
				if(ids[4]!=null){
				  reportArgs.dah5 = ids[4]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah5 =""
				}
				if(ids[5]!=null){
				  reportArgs.dah6 = ids[5]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah6 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过6条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }
		 

	}
	//2cm
	function PrintBJ2Winwdow(){
		 if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=6) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj2"						//模块编号
				report_no = "dabj2"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				if(ids[0]!=null){
				  reportArgs.dah1 = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah1 =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				if(ids[2]!=null){
				  reportArgs.dah3 = ids[2]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah3 =""
				}
				if(ids[3]!=null){
				  reportArgs.dah4 = ids[3]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah4 =""
				}
				if(ids[4]!=null){
				  reportArgs.dah5 = ids[4]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah5 =""
				}
				if(ids[5]!=null){
				  reportArgs.dah6 = ids[5]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah6 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过6条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }
	}
	
	//2.5cm
	function PrintBJ25Winwdow(){
		 if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=6) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj2.5"						//模块编号
				report_no = "dabj2.5"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				if(ids[0]!=null){
				  reportArgs.dah1 = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah1 =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				if(ids[2]!=null){
				  reportArgs.dah3 = ids[2]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah3 =""
				}
				if(ids[3]!=null){
				  reportArgs.dah4 = ids[3]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah4 =""
				}
				if(ids[4]!=null){
				  reportArgs.dah5 = ids[4]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah5 =""
				}
				if(ids[5]!=null){
				  reportArgs.dah6 = ids[5]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah6 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过6条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }
	}
	//3cm
	function PrintBJ3Winwdow(){
		 if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=4) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "test"						//模块编号
				report_no = "test"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				if(ids[0]!=null){
				  reportArgs.dah1 = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah1 =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				if(ids[2]!=null){
				  reportArgs.dah3 = ids[2]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah3 =""
				}
				if(ids[3]!=null){
				  reportArgs.dah4 = ids[3]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah4 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过4条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }
		 
	}
	
	//4cm
	function PrintBJ4Winwdow(){
		 if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=3) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj4"						//模块编号
				report_no = "dabj4"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				if(ids[0]!=null){
				  reportArgs.dah1 = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah1=""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				if(ids[2]!=null){
				  reportArgs.dah3 = ids[2]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah3 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过3条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }
		
	
	}
	//5cm
	function PrintBJ5Winwdow(){
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=2) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj5"						//模块编号
				report_no = "dabj5"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				if(ids[0]!=null){
				  reportArgs.dah1 = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah1 =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过2条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }
	}
	//6cm
	function PrintBJ6Winwdow(){
		
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=2) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj6"						//模块编号
				report_no = "dabj6"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				//onReportOpened = "reporjb"
				if(ids[0]!=null){
				  reportArgs.dah = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过2条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }

	}
	//7cm
	function PrintBJ7Winwdow(){
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=2) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj7"						//模块编号
				report_no = "dabj7"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				//onReportOpened = "reporjb"
				if(ids[0]!=null){
				  reportArgs.dah = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过2条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }	
	}
	//8cm
	function PrintBJ8Winwdow(){
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0 && records.length<=2) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj8"						//模块编号
				report_no = "dabj8"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				//onReportOpened = "reporjb"
				if(ids[0]!=null){
				  reportArgs.dah = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah =""
				}
				if(ids[1]!=null){
				  reportArgs.dah2 = ids[1]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah2 =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
		 else{
		 	
		 		Ext.MessageBox.show({
							title : '警告',
							msg : '打印记录不能超过2条！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
		 }
	}
	//9cm
	function PrintBJ9Winwdow(){
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj9"						//模块编号
				report_no = "dabj9"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				//onReportOpened = "reporjb"
				if(ids[0]!=null){
				  reportArgs.dah = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
	
	}
	//10cm
	function PrintBJ10Winwdow(){
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj10"						//模块编号
				report_no = "dabj10"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				//onReportOpened = "reporjb"
				if(ids[0]!=null){
				  reportArgs.dah = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
	}
	//11cm
	function PrintBJ11Winwdow(){
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj11"						//模块编号
				report_no = "dabj11"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				//onReportOpened = "reporjb"
				if(ids[0]!=null){
				  reportArgs.dah = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
	}
	//12cm
	function PrintBJ12Winwdow(){	
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要打印的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
	    var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('daid'));
			}
			 with(document.all.dbnetcell0){
				code = "dabj12"						//模块编号
				report_no = "dabj12"		//报表编号
				reportArgs = new Object()		//报表参数，可用变量赋值以对应不同的记录
				//onReportOpened = "reporjb"
				if(ids[0]!=null){
				  reportArgs.dah = ids[0]//报表参数的值   bc 是参数名称
				}else{
					reportArgs.dah =""
				}
				readOnly = true					//可选，报表是否可以保存，默认为false
				open()					//调用open方法打开报表，返回流水号
		 	}
		 	
		 }
	}
	////////////////////////////////////////////////////////////////
	function QueryDaWinwdow() {
		if (!formWin) {
			formWin = new Ext.Window({
				title : '查询数据',
				width : 460,
				height : 460,
				layout : 'fit',
				iconCls : 'form',
				closeAction : 'hide',
				border : true,
				constrain : true,
				maximizable : true,
				modal : true,
				items : [QueryDAPanel]
			});
		}
		QueryDAPanel.getForm().reset();
		formWin.show();
	}
	// /////////////////////////////////////////////////////////////////////////
	DWREngine.setAsync(false);
	appMgm.getCodeValue('立卷单位',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			databzdw.push(temp);			
		}
    });
    appMgm.getCodeValue('档案密级',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			damj.push(temp);			
		}
    });
    appMgm.getCodeValue('专业',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			datazy.push(temp);			
		}
    });
    appMgm.getCodeValue('脊背厚度',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			bjhdStr.push(temp);			
		  }
    });
    appMgm.getCodeValue("档号序号",function(list){       //获取档号序号
    	for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			dhArr.push(temp);			
		  }
    });
	DWREngine.setAsync(true);
	var damjStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : damj
    });
	 var bzdwStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : databzdw
    });
    var zyStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : datazy
    });
    var bjhdStore = new Ext.data.SimpleStore({
        fields :['k','v'],
        data : bjhdStr
    })
	var dsindexid = new Ext.data.SimpleStore({fields: [], data: [[]]});
	sm = new Ext.grid.CheckboxSelectionModel()
	var fm = Ext.form; // 包名简写（缩写）
	
	var fc = { // 创建编辑域配置
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'daid' : {
			name : 'daid',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'indexid' : {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'mc' : {
			name : 'mc',
			fieldLabel : '案卷题名',
			//height: 80,
			width: 600,
			//xtype: 'htmleditor',
			anchor:'95%'
		},
		'gdrq' : {
			name : 'gdrq',
			fieldLabel : '归档日期',
			width : 45,
			allowBlank: false,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'dagh' : {
			name : 'dagh',
			fieldLabel : '档案馆号',
			anchor : '95%'
		},
		'swh' : {
			name : 'swh',
			fieldLabel : '缩微号',
			anchor : '95%'
		},
		'bzdw' : {
			name : 'bzdw',
			fieldLabel : '立卷单位',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选立卷单位...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: bzdwStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            allowBlank: false,
			anchor:'95%'
		},
		'bgqx' : {
			name : 'bgqx',
			fieldLabel : '保管期限',
			anchor : '95%'
		},
		'mj' : {
			name : 'mj',
			fieldLabel : '密级',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选密级...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: damjStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			anchor : '95%'
		},
		'bzrq' : {
			name : 'bzrq',
			fieldLabel : '起止日期',
			//readOnly : true,
			anchor : '95%'
		},
		'sl' : {
			name : 'sl',
			fieldLabel : '数量',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'ztc' : {
			name : 'ztc',
			fieldLabel : '主题词',
			hidden : true,
			hideLabel : true,
			width: 600,
			//xtype: 'htmleditor',
			anchor:'95%'
		},
		'flmc' : {
			name : 'flmc',
			fieldLabel : '分类名称',
			anchor : '95%'
		},
		'bfjs':{
			name : 'bfjs',
			fieldLabel : '件数',
			anchor : '95%'
		},
		'bfys':{
			name : 'bfys',
			fieldLabel : '每份页数',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'kwh':{
			name : 'kwh',
			fieldLabel : '库位号',
			anchor : '95%'
		},
		'bz' :{
			name : 'bz',
			fieldLabel : '备注',
			height: 120,
			width: 600,
//			xtype: 'htmleditor',
			anchor:'95%'
		},
		'jnsm':{
			name : 'jnsm',
			fieldLabel : '卷内说明',
			//height: 100,
			width: 600,
			//xtype: 'htmleditor',
			anchor:'95%'
		},
		'ljr':{
			name : 'ljr',
			fieldLabel : '立卷人',
			anchor : '95%'
		},
		'ljrq' : {
			name : 'ljrq',
			fieldLabel : '立卷日期',
			width : 45,
			allowBlank: false,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'jcr':{
			name : 'jcr',
			fieldLabel : '检查人',
			anchor : '95%'
		},
		'jcrq' : {
			name : 'jcrq',
			fieldLabel : '检查日期',
			width : 45,
			allowBlank: false,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'daState':{
			name : 'daState',
			fieldLabel : '档案状态',
			anchor : '95%'
		},
		'dabh':{
			name : 'dabh',
			fieldLabel : '档案号',
			anchor : '95%'
		},
		'hjh':{
			name : 'hjh',
			fieldLabel : '互见号',
			anchor : '95%'
		},
		'dh':{
			name : 'dh',
			fieldLabel : '档号',
			anchor : '95%'
		},
		'orgid':{
			name : 'orgid',
			fieldLabel : '部门ID',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'zy':{
			name : 'zy',
			fieldLabel : '专业',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选专业...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: zyStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			anchor : '95%'
		},
		'wbxs':{
			name : 'wbxs',
			fieldLabel : '文本形式',
			anchor : '95%'
		},
		'filelsh':{
			name : 'filelsh',
			fieldLabel : '电子文档',
			anchor : '95%'
		},'filename':{
			name : 'filename',
			fieldLabel : '文件名称',
			anchor : '95%'
		},'jcjsh':{
			name : 'jcjsh',
			fieldLabel : '卷册检索号',
			anchor : '95%'
		},'zys':{
			name : 'zys',
			fieldLabel : '总页数',
			disabled:true,
			readOnly : true,
			anchor : '95%'
		},'bjhd':{
			name : 'bjhd',
			fieldLabel : '脊背厚度',
			anchor : '95%',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选脊背厚度...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: bjhdStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
//            allowBlank: false,
			anchor:'95%'
		
		},'kcfs':{
			name : 'kcfs',
			fieldLabel : '库存份数',
			anchor : '95%'
		}
		
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, // 第0列，checkbox,行选择器
			new Ext.grid.RowNumberer({
			header : '序号',
			 width : 38
			 }),// 计算行数
			{
				id : 'daid',
				header : fc['daid'].fieldLabel,
				dataIndex : fc['daid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'dh',
				header : fc['dh'].fieldLabel,
				dataIndex : fc['dh'].name,
				width : 200
			},{
				id :'zys',
				header : fc['zys'].fieldLabel,
				dataIndex : fc['zys'].name,
				width : 100,
				renderer:function(v){
					if(v!='null'){
						return v;
					}else{
						return "";
					}
				}
			},{
			    id : 'bjhd',
			    header : fc['bjhd'].fieldLabel,
			    dataIndex : fc['bjhd'].name,
			    width : 100,
			    renderer : bjhdRender
			},
			{
				id : 'jcjsh',
				header : fc['jcjsh'].fieldLabel,
				dataIndex : fc['jcjsh'].name,
				width : 200
			},
			{
				id : 'bzrq',
				header : fc['bzrq'].fieldLabel,
				dataIndex : fc['bzrq'].name,
				width : 150
			},
			{
				id : 'mc',
				header : fc['mc'].fieldLabel,
				dataIndex : fc['mc'].name,
				width : 300
			}, {
				id : 'bzdw',
				header : fc['bzdw'].fieldLabel,
				dataIndex : fc['bzdw'].name,
				width : 200,
				renderer : partbRender
			},{
				id : 'gdrq',
				header : fc['gdrq'].fieldLabel,
				dataIndex : fc['gdrq'].name,
				width : 150,
				renderer : formatDate
			}, {
				id : 'bgqx',
				header : fc['bgqx'].fieldLabel,
				dataIndex : fc['bgqx'].name,
				width : 150,
				renderer : function(Value) {
					if (Value == 1) {
						return '短期'
					}
					if (Value == 2) {
						return '长期'
					}
					if (Value == 3) {
						return '永久'
					}
				}
			}, {
				id : 'mj',
				header : fc['mj'].fieldLabel,
				dataIndex : fc['mj'].name,
				width : 100,
				renderer : mjRender
			}, 
			{
				id : 'zy',
				header : fc['zy'].fieldLabel,
				dataIndex : fc['zy'].name,
				width : 150,
				renderer :partzyRender
			},
			{
				id : 'wbxs',
				header : fc['wbxs'].fieldLabel,
				dataIndex : fc['wbxs'].name,
				width : 150,
				renderer: function(Value){
					if (Value == 1) {
						return '正本'
					}
					if (Value == 2) {
						return '副本'
					}
				}
			},
			{
				id : 'bfjs',
				header : fc['bfjs'].fieldLabel,
				dataIndex : fc['bfjs'].name,
				width : 150
			},
			{
				id : 'kcfs',
				header : fc['kcfs'].fieldLabel,
				dataIndex : fc['kcfs'].name,
				width : 100
			},
			{
				id : 'ljr',
				header : fc['ljr'].fieldLabel,
				dataIndex : fc['ljr'].name,
				width : 150
			}, {
				id : 'ljrq',
				header : fc['ljrq'].fieldLabel,
				dataIndex : fc['ljrq'].name,
				width : 150,
				renderer : formatDate
			}, {
				id : 'indexid',
				header : fc['indexid'].fieldLabel,
				dataIndex : fc['indexid'].name,
				hidden : true,
				renderer : function(v){
				    for(var i=0;i<indexidStr.length;i++){
				      if(v == indexidStr[i][0])
				         return indexidStr[i][1];
				    }
				}
			},
			 {
				id : 'orgid',
				header : fc['orgid'].fieldLabel,
				dataIndex : fc['orgid'].name,
				hidden : true
			},
			{
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				width : 120,
				renderer : fileicon
			},{
				id : 'bz',
				header : fc['bz'].fieldLabel,
				dataIndex : fc['bz'].name,
				width : 120,
				hidden:false
			}
			
	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
		name : 'daid',
		type : 'string'
	}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'indexid',
				type : 'string'
			}, {
				name : 'mc',
				type : 'string'
			}, {
				name : 'gdrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'dagh',
				type : 'string'
			}, {
				name : 'swh',
				type : 'string'
			}, {
				name : 'bzdw',
				type : 'string'
			}, {
				name : 'bgqx',
				type : 'string'
			}, {
				name : 'mj',
				type : 'string'
			}, {
				name : 'bzrq',
				type : 'string'
			},{
				name : 'sl',
				type : 'float'
			},{
				name : 'ztc',
				type : 'string'
			}, {
				name : 'flmc',
				type : 'string'
			}, {
				name : 'bfjs',
				type : 'float'
			}, {
				name : 'bfys',
				type : 'float'
			},{
				name : 'kwh',
				type : 'string'
			},{
				name : 'bz',
				type : 'string'
			},{
				name : 'jnsm',
				type : 'string'
			},{
				name : 'ljr',
				type : 'string'
			},{
				name : 'ljrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'jcr',
				type : 'string'
			},{
				name : 'jcrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'daState',
				type : 'float'
			},{
				name : 'dabh',
				type : 'string'
			},{
				name : 'hjh',
				type : 'string'
			},{
				name : 'dh',
				type : 'string'
			},
			{
				name : 'orgid',
				type : 'string'
			},
			{
				name : 'zy',
				type : 'string'
			},
			{
				name : 'wbxs',
				type : 'float'
			},
			{
				name : 'filelsh',
				type : 'string'
			},
			{
				name : 'filename',
				type : 'string'
			},
			{
				name : 'jcjsh',
				type : 'string'
			},{
				name : 'zys',
				type : 'string'
			},{
			    name : 'bjhd',
			    type :'string'
			},{
			    name : 'kcfs',
			    type : 'float'
			}
			];
	var Fields = Columns.concat([ // 表单增加的列
	      
			])

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	PlantInt = {
		daState:0,
		ljr:username,
		mc: '',
		jcrq:new Date,
		zys :0,
		bjhd : 0,
		kcfs :0
	}; // 初始值
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
		jcrq: new Date
	});

	// 4. 创建数据源
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
//			pid:currentPid,
			params :ds_pid+" indexid like '%"+selectedTreeData+"%'  "//order by bjhd , gdrq, dh asc
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : ServletUrl
		}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),

		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
	// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
	});
	ds.setDefaultSort(orderColumn, 'asc'); // 设置默认排序列
	var ietm = [
            {
                text: '打印案卷题名',
                iconCls: 'print',
                handler: PrintFmWinwdow
            },'-', {
                text: '打印卷内备考表',
                iconCls: 'print',
                handler: PrintJNBKBWinwdow
            },'-', {
                text: '打印案卷目录',
                iconCls: 'print',
                handler: PrintfnmlWinwdow
            },'-', {
                text: '打印卷内目录',
                iconCls: 'print',
                handler: PrintMLWinwdow
            },'-',{
                text: '打印案卷脊背(1.5cm格式)',
                iconCls: 'print',
                handler: PrintBJWinwdow
            },'-',
            {
                text: '打印案卷脊背(2cm格式)',
                iconCls: 'print',
                handler: PrintBJ2Winwdow
            },'-',
            {
                text: '打印案卷脊背(2.5cm格式)',
                iconCls: 'print',
                handler: PrintBJ25Winwdow
            },'-',
            {
                text: '打印案卷脊背(3cm格式)',
                iconCls: 'print',
                handler: PrintBJ3Winwdow
            },'-',
            {
                text: '打印案卷脊背(4cm格式)',
                iconCls: 'print',
                handler: PrintBJ4Winwdow
            },'-',
            {
                text: '打印案卷脊背(5cm格式)',
                iconCls: 'print',
                handler: PrintBJ5Winwdow
            },'-',
             {
                text: '打印案卷脊背(6cm格式)',
                iconCls: 'print',
                handler: PrintBJ6Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(7cm格式)',
                iconCls: 'print',
                handler: PrintBJ7Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(8cm格式)',
                iconCls: 'print',
                handler: PrintBJ8Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(9cm格式)',
                iconCls: 'print',
                handler: PrintBJ9Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(10cm格式)',
                iconCls: 'print',
                handler: PrintBJ10Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(11cm格式)',
                iconCls: 'print',
                handler: PrintBJ11Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(12cm格式)',
                iconCls: 'print',
                handler: PrintBJ12Winwdow
            }
        ];
      if(currentPid == '1031902'){
      	ietm = [
            {
                text: '打印案卷题名',
                iconCls: 'print',
                handler: PrintFmWinwdow
            },'-', {
                text: '打印卷内备考表',
                iconCls: 'print',
                handler: PrintJNBKBWinwdow
            },'-', {
                text: '打印案卷目录',
                iconCls: 'print',
                handler: PrintfnmlWinwdow
            },'-', {
                text: '打印卷内目录',
                iconCls: 'print',
                handler: PrintMLWinwdow
            },'-',{
            	text: '打印案卷移交目录',
                iconCls: 'print',
                handler: PrintyjmlWinwdow
            },'-',{
                text: '打印案卷脊背(1.5cm格式)',
                iconCls: 'print',
                handler: PrintBJWinwdow
            },'-',
            {
                text: '打印案卷脊背(2cm格式)',
                iconCls: 'print',
                handler: PrintBJ2Winwdow
            },'-',
            {
                text: '打印案卷脊背(2.5cm格式)',
                iconCls: 'print',
                handler: PrintBJ25Winwdow
            },'-',
            {
                text: '打印案卷脊背(3cm格式)',
                iconCls: 'print',
                handler: PrintBJ3Winwdow
            },'-',
            {
                text: '打印案卷脊背(4cm格式)',
                iconCls: 'print',
                handler: PrintBJ4Winwdow
            },'-',
            {
                text: '打印案卷脊背(5cm格式)',
                iconCls: 'print',
                handler: PrintBJ5Winwdow
            },'-',
             {
                text: '打印案卷脊背(6cm格式)',
                iconCls: 'print',
                handler: PrintBJ6Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(7cm格式)',
                iconCls: 'print',
                handler: PrintBJ7Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(8cm格式)',
                iconCls: 'print',
                handler: PrintBJ8Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(9cm格式)',
                iconCls: 'print',
                handler: PrintBJ9Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(10cm格式)',
                iconCls: 'print',
                handler: PrintBJ10Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(11cm格式)',
                iconCls: 'print',
                handler: PrintBJ11Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(12cm格式)',
                iconCls: 'print',
                handler: PrintBJ12Winwdow
            }
        ];
      }
	 var printMenu = new Ext.menu.Menu({
        id: 'mainMenu',
        items: ietm
    });

    
	// 5. 创建可编辑的grid: grid-panel
	grid = new Ext.grid.EditorGridTbarPanel({
		// basic properties
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		// renderTo: 'editorgrid', //所依附的DOM对象，可选
		tbar : [], // 顶部工具栏，可选
		// width : 800, //宽
		title : gridPanelTitle, // 面板标题
		// iconCls: 'icon-show-all', //面板样式
		border : false, // 
		region : 'center',
		clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
		header : true, //
		// frame: false, //是否显示圆角边框
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
//			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),

		// expend properties
		plant : Plant, // 初始化记录集，必须
		plantInt : PlantInt, // 初始化记录集配置，必须
		servletUrl : ServletUrl, // 服务器地址，必须
		bean : bean, // bean名称，必须
		business : "baseMgm", // business名称，可选
		primaryKey : primaryKey, // 主键列名称，必须
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		saveHandler : saveFun,
		//deleteMethod : 'delete'
		deleteHandler : deleteFun
	});
    storeSelects(ds,sm);
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE,
			params : ds_pid+" indexid in "+getStr(selectedTreeData)+" order by bjhd asc, gdrq asc,dh asc"
		}
	});

	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [grid]
	});

	viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});
	// /////////////////////////////////////////////////////
	root.select();
   	grid.showHideTopToolbarItems("save", false);
   	grid.showHideTopToolbarItems("refresh", false);
	var gridTopBar = grid.getTopToolbar()
	with (gridTopBar) {
		add(update,'-',dazl,'-',btnDaQuery,'-',{text:'打印', iconCls: 'print', menu:printMenu});//btnPrintFM,'-',btnPrintJNBKB,'-',btnPrintBJ,'-',btnPrintML);
	}
	if(selectedBM == ''){
		gridTopBar.items.get('update').disable();
	}else{
		gridTopBar.items.get('update').enable();
	}
	// 11. 事件绑定
	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					tb.items.get("dazl").enable();
					//tb.items.get("update").enable();
					/*tb.items.get("printfm").enable();
					tb.items.get("printjnbkb").enable();
					tb.items.get("printml").enable();
					tb.items.get("printbj").enable();*/
					
					
				} else {
					tb.items.get("dazl").disable();
					//tb.items.get("update").disable();
					/*tb.items.get("printfm").disable();
					tb.items.get("printjnbkb").disable();
					tb.items.get("printml").disable();
					tb.items.get("printbj").disable();*/
				}
				if (formWindow != null && !formWindow.hidden) {
					
				}
			});
	treePanel.render();
	treePanel.expand();

	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};
	
	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
	 ////////////////////////////////////////////////////////////
	
	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		url: MAIN_SERVLET+"?ac=upload",   
	  	fileUpload: true,
		bodyStyle: 'padding: 20px 20px;',
		//url: "/wbf/servlet/FlwServlet?ac=extUpload",
		autoScroll: true,
		labelAlign: 'right',
		bbar: ['->', {
			id: 'uploadBtn',
			text: '上传附件',
			iconCls: 'upload',
			//disabled: true,
			handler: function(){
				var filename = fileForm.form.findField("filename1").getValue()
				
				fileForm.getForm().submit({
					method: 'POST',
	          		params:{ac:'upload'},
					waitTitle: '请等待...',
					waitMsg: '上传中...',
					success: function(form, action){
						tip = Ext.QuickTips.getQuickTip();
						tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
						tip.show();
						Ext.MessageBox.hide();
			            uploadWin.hide();
						var infos = action.result.msg;
						var fileid = infos[0].fileid; 
						var filename = infos[0].filename;
						formPanelinsert.getForm().findField('filelsh').setValue(fileid);
						formPanelinsert.getForm().findField('filename').setValue(filename);
						//formPanelinsert.getForm().findField('materialname').setValue(filename)
					},
					failure: function(form, action){
						Ext.Msg.alert('Error', 'File upload failure.'); 
					}
				})
			}
		}]
	});
	
	function uploadFile(){
		if (fileForm.items) 
			fileForm.items.removeAt(0);
			fileForm.insert({   
			    xtype: 'textfield',   
			    fieldLabel: '流水号',   
			    name: 'fileid1',
			    readOnly: true,
			    hidden: true,
			    hideLabel: true,
			    anchor: '90%'  // anchor width by percentage   
			  },{   
			    xtype: 'textfield',   
			    fieldLabel: '请选择文件',   
			    name: 'filename1',   
			    inputType: 'file',   
			    allowBlank: false,   
			    blankText: 'File can\'t not empty.',   
			    anchor: '90%'  // anchor width by percentage   
			  });
				uploadWin = new Ext.Window({
				title: '附件上传',
				layout: 'fit', closeAction: 'hide', iconCls: 'upload', 
				maximizable: false, closable: true,
				resizable: false, modal: true, border: false,
				width: 380, height: 130,
				items: [fileForm]
		});
		uploadWin.show();
	}
	
	 var upload = new Ext.Button({
	 	id : 'newupload',
    	iconCls: 'upload-icon',
    	tooltip: '上传附件',
    	handler: uploadFile
    })
    ////////////////////////////////////////////////////
	var daCombo = new fm.ComboBox({
		name: 'dh',
		fieldLabel: '档号',
		allowBlank : false,
	    emptyText : '请选择...',
		valueField: 'k',
		displayField: 'v',
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: new Ext.data.SimpleStore({
        	data: dhArr,
        	fields: ['k', 'v']
        }),
        lazyRender: true,
        listClass: 'x-combo-list-small',
		anchor: '95%'
	});
	daCombo.on('select', function(combo, record, index){
		
		if(CURRENTAPPID == "1030902" || CURRENTAPPID == "1030903"){
			combo.setRawValue(combo.getValue());
			combo.setValue(combo.getValue());
		}else{
			var num = '00';
			baseMgm.getData("select t.indexid from DA_ZL t where t.indexid in "+getStr(selectedTreeData)+" and t.dh like '"+daCombo.getValue()+"%'",function(list){//生成流水号
				num = num + (list.length+1);
				if(list.length>8 && list.length<99){
					num = '0'+(list.length+1);
				}
				if(list.length >=99){
					num = list.length+1;
				}
				combo.setRawValue(combo.getValue()+'-'+selectedBM+'-'+num);
				combo.setValue(combo.getValue()+'-'+selectedBM+'-'+num);
			});
		}
	});
	// 6. 创建表单form-panel
	var formPanelinsert = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		//bodyStyle: 'padding:10px 10px; border:2px dashed #3764A0',
		iconCls: 'icon-detail-form',
		labelAlign: 'top',
		//listeners: {beforeshow: handleActivate},
	 	items: [
    			new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
					            // new fm.TextField(fc['dh'])
	   						daCombo,
	   						new fm.TextField(fc['dagh']),
	   					    new fm.ComboBox(fc['bjhd'])
						]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.ComboBox(fc['zy']),
    							new fm.ComboBox({
					            		name: 'wbxs',
										fieldLabel: '正/副本',
										allowBlank : true,
									    emptyText : '请选择...',
										valueField: 'k',
										displayField: 'v',
										mode: 'local',
							            typeAhead: true,
							            triggerAction: 'all',
							            store: new Ext.data.SimpleStore({
							            	data: [['1','正本'],['2','副本']],
							            	fields: ['k', 'v']
							            }),
							            lazyRender: true,
							            listClass: 'x-combo-list-small',
										anchor: '95%'
					            	})
    							
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['hjh']),
    							new fm.TextField(fc['jcjsh'])
    							
    					      ]
    				  }    				
    			]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
                //border:true, 
               // title:'案卷题名',
                cls:'x-plain',  
                items: [
   					//fc['mc']
                new fm.TextField(fc['mc'])
                   	
				]
    		}),
    		new Ext.form.FieldSet({
    			//title: '基本信息',
                //border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		new fm.DateField(fc['gdrq']),
		                		new fm.NumberField(fc['bfjs'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	new fm.DateField(fc['ljrq']),
				            	new fm.TextField(fc['zys']),
				            	new fm.NumberField(fc['sl'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	new fm.TextField(fc['ljr']),
				            	new fm.NumberField(fc['kcfs']),
				            	new fm.NumberField(fc['bfys'])
				            	
    					      ]
    				  }    				
    			]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
               // border:true, 
               // title:'编制单位',
                cls:'x-plain',  
                items: [
   					//fc['bzdw']
   					new fm.ComboBox(fc['bzdw'])
                   	
				]
    		}),
    		new Ext.form.FieldSet({
    			//title: '基本信息',
                //border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		  new fm.TextField(fc['bzrq'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	new fm.ComboBox({
				            		name: 'bgqx',
									fieldLabel: '保管期限',
									allowBlank : false,
									emptyText : '请选择...',
									valueField: 'k',
									displayField: 'v',
									mode: 'local',
						            typeAhead: true,
						            triggerAction: 'all',
						            store: new Ext.data.SimpleStore({
						            	data: [['1','短期'],['2','长期'],['3','永久']],
						            	fields: ['k', 'v']
						            }),
						            lazyRender: true,
						            listClass: 'x-combo-list-small',
									anchor: '95%'
				            	})
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	new fm.ComboBox({
					            		name: 'mj',
										fieldLabel: '密级',
										allowBlank : true,
									    emptyText : '请选择...',
										valueField: 'k',
										displayField: 'v',
										mode: 'local',
							            typeAhead: true,
							            triggerAction: 'all',
							            store:damjStore,
							             //new Ext.data.SimpleStore({
							            	//data: [['1','公开'],['2','机密'],['3','秘密'],['4','绝密']],
							            	//fields: ['k', 'v']
							            //}),
							            lazyRender: true,
							            listClass: 'x-combo-list-small',
										anchor: '95%'
					            	})
    					      ]
    				  }    				
    			]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
               // border:true, 
               // title:'主题词',
                cls:'x-plain',  
                items: [
   					//fc['ztc']
   					new fm.TextField(fc['ztc'])
                   	
				]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
               // border:true, 
                //title:'卷内说明',
                cls:'x-plain',  
                items: [
   					//fc['jnsm']
   					new fm.TextField(fc['jnsm'])
                   	
				]
    		}),
   			new Ext.form.FieldSet({
    			layout: 'form',
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [
   					new fm.TextArea(fc['bz'])
                   	
				]
    		}),
    		new Ext.form.FieldSet({
    			//title: '基本信息',
                //border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		 new fm.TextField(fc['jcr']),
		                		 new fm.TextField(fc['filename'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	new fm.DateField(fc['jcrq']),
				            	new fm.TextField(fc['filelsh']),
				            	new fm.TextField(fc['indexid'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	new fm.TextField(fc['kwh']),
				            	
				     			new fm.TextField(fc['orgid']),
    							{
					            	border: false,
	    							layout: 'form',
	    							bodyStyle: 'padding: 3px',
					            	items: [upload]
				            	},
				            	new fm.TextField(fc['pid']),
				            	new fm.TextField(fc['daid']),
				            	
				            	new fm.TextField(fc['orgid'])
    					      ]
    				  }    				
    			]
    		})
    	],
    	buttons: [{
			id: 'save',
            text: '保存',
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
//            	history.back();
            	formWindow.hide();
            }
        }]
	});
	function insertFun() {
		if (tmp_parent != true) {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择子节点！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}

		//grid.defaultInsertHandler();
		
		if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:400,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       	}
       	operate="0";
       	formPanelinsert.getForm().reset();
       	formWindow.show();
        
		var form = formPanelinsert.getForm();
		form.findField("indexid").setValue(selectedTreeDataIndexid);
		form.findField("pid").setValue(currentPid);
		form.findField("ljr").setValue(username);
		form.findField("orgid").setValue(USERORGID);
		form.findField("zys").setValue('0');
		//form.findField("mc").setValue('山西耀光煤电有限责任公司2×200MW机组');       
	};

	function loadForm(){
		//////////
		var form = formPanelinsert.getForm();
    	if (sm.getSelected()!=null)
    	{
    		var gridRecod = sm.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsInt);
    				for(var i=0; i<Columns.length; i++){
    					if (typeof(temp[Columns[i].name])!="undefined"){
    						temp[Columns[i].name] = gridRecod.get(Columns[i].name)
    					}
    				}
    				form.loadRecord(new PlantFields(temp))
    			}
    			else
    			form.loadRecord(new PlantFields(PlantFieldsInt))
    			//form.reset()
    			formPanelinsert.buttons[0].enable()
    	
    			formPanelinsert.isNew = true
    		}
    		else
    		{
	    		var ids = sm.getSelected().get(primaryKey)
	    		baseMgm.findById(bean, ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
		    				return;
			    		}
			    		var obj = new Object();
			    		for(var i=0; i<Fields.length; i++){
			    			var n = Fields[i].name
			    			obj[n] = rtn[n]
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<Columns.length; i++){
		    					if (typeof(obj[Columns[i].name])!="undefined"){
		    						obj[Columns[i].name] = gridRecod.get(Columns[i].name)
		    					}
		    				}
					    }	
			    		var record = new PlantFields(obj)
			    		form.loadRecord(record)
			    		formPanelinsert.buttons[0].enable()
			    		formPanelinsert.isNew = false
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFields(PlantFieldsInt))
    		formPanel.buttons[0].disable()
    	}  
	}
   function updatedept(){
    if(!sm.hasSelection()){
    	Ext.MessageBox.show({
						title : '警告',
						msg : '请选择将要修改的记录！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
					return;
    }
     
   	if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:400,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       	}
       	operate="1";
       	formWindow.show();
       	loadForm();
   }
   function dazlwin(){
	     if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要组卷的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
        var record = sm.getSelected();
		var id = record.get('daid');
		if (!dazjWin) {
			dazjWin = new Ext.Window({
				title : '组卷信息',
				layout : 'fit',
				border : false,
      			modal : true,
				width : document.body.clientWidth,
				height : document.body.clientHeight,
				closeAction : 'hide',
				items : [new Ext.Panel({
							contentEl : 'dazjDiv'
						})],
				listeners:{
					'hide':function(){
						ds.load({
							params:{
							 	start: 0,
							 	limit: PAGE_SIZE
							}
						});
					}
				}
		});
	}
		
	dazjWin.show();
    
	if (dazjWin) {
		document.all('dazjIFrame').src = "Business/document/da.zl.info.jsp?id="+id;
	}
   }
   
	function saveFun() {
		grid.defaultSaveHandler();

	};
	
	
	function deleteFun(){
		var id = sm.getSelected().get(primaryKey)
		zlMgm.getRowCount(id,function(cn){
			if (0 < cn){
					Ext.Msg.show({
					   title: '提示',
					   msg: '该档案下还有资料,不能删除！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO 
					});
				}else{
					grid.defaultDeleteHandler()
				}
		})
	}
	
	
	

	function formSave() {
		/*var form = formPanelinsert.getForm()
		if (form.isValid()) {
			doFormSave(true)	
		}
		
		*/
		//var form = formPanel.getForm()
    	
		///////////////////////////////////////////////////////////
		var form = formPanelinsert.getForm();
		var obj = new Object();
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = n=='dh'?field.getRawValue():field.getValue();
    		}
    	}
		var record = new PlantFields(obj)
		var getslectdh;
		var getslectid=record.get('daid');
		DWREngine.setAsync(false);
	     		zlMgm.getdh(getslectid, function(value){
	     			getslectdh=value;
	     		});
	    DWREngine.setAsync(true);
    	var ids = form.findField(primaryKey).getValue();
     	if (form.isValid()){
     		var r_fileno = form.findField('dh').getRawValue();
     		if (r_fileno!= getslectdh){
	     		DWREngine.setAsync(false);
	     		zlMgm.checkdh(r_fileno, function(flag){
	     			if (flag){
	     				doFormSave();
	     			} else {
	     				Ext.Msg.show({
							title: '提示',
							msg: '档号已存在,请重新输入!',
							buttons: Ext.Msg.OK,
							/*fn: function(value){
								r_fileno.focus();
								//r_fileno.getEl().dom.select();
							},*/
							icon: Ext.MessageBox.WARNING
						});
	     			}
	     		});
	     		DWREngine.setAsync(true);
     		}else{
     			doFormSave();
     		
     		}
	    }
	}

	function partbRender(value) {
		var str = '';
		for (var i = 0; i < databzdw.length; i++) {
			if (databzdw[i][0] == value) {
				str = databzdw[i][1]
				break;
			}
		}
		return str;
	}
	function bjhdRender(value){
	    var str ='';
	    for(var i = 0; i <bjhdStr.length; i++){
	       if(bjhdStr[i][0] == value){
	           str = bjhdStr[i][1]
	           break;
	       }
	    }
	    return str;
	}
	function partzyRender(value) {
		var str = '';
		for (var i = 0; i < datazy.length; i++) {
			if (datazy[i][0] == value) {
				str = datazy[i][1]
				break;
			}
		}
		return str;
	}
	function mjRender(value) {
		var str = '';
		for (var i = 0; i < damj.length; i++) {
			if (damj[i][0] == value) {
				str = damj[i][1]
				break;
			}
		}
		return str;
	}
	function fileicon(value) {
        if (value != '') {
            if(NTKOWAY&&NTKOWAY!=null&&NTKOWAY==1){
                var type="common";
                var filename;
                var suffix;
                var sql="select fileid,mimetype,filename from  APP_FILEINFO where fileid='"+value+"'";
                DWREngine.setAsync(false);
                db2Json.selectData(sql, function (jsonData) {
                var list = eval(jsonData);
                if(list!=null&&list&&list[0]){
                    type=list[0].mimetype;
                    filename=list[0].filename;
                  }  
                 });
                DWREngine.setAsync(true);
                var downloadStr="下载";
                if(filename){
                    var index=filename.lastIndexOf(".");
                    suffix=filename.substring(index+1,filename.length);             
                }
                if(suffix=="doc"||suffix=="docx"||"application/msword"==type||"application/vnd.openxmlformats-officedocument.wordprocessingml.document"==type){
                    //downloadStr="<img src='" + BASE_PATH+ "jsp/res/images/word.gif'></img>";
                    downloadStr = "打开";
                    return '<center><a href="javascript:showUploadWin( \''+ value+ '\')">'
                                                    + downloadStr + '</a></center>';                
                }else{
                    return "<center><a href='" + BASE_PATH
                            + "servlet/BlobCrossDomainServlet?ac=appfile&fileid="
                            + value + "&pid=" + CURRENTAPPID+"'>下载</a></center>";               
                     }                  
            }else{
                //将合同模块附件打开方式修改为跨域文件下载
                return '<center><a href="javascript:downloadFile(\''+value+'\')"><img src="' + BASE_PATH
                        + 'jsp/res/images/word.gif"></img></a></center>';   
            }
        }   
    }
	function doFormSave(dataArr){
    	var form = formPanelinsert.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = n=='dh'?field.getRawValue():field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.daid == '' || obj.daid == null){
	   		zlMgm.savedazl(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				Ext.Msg.show({
					   title: '提示',
					   msg: '是否继续新增?',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
	   		});
   		}else{
   			zlMgm.updatedazl(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
	   				ds.baseParams.params = ds_pid+" indexid in "+getStr(selectedTreeData);
					ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
	   		});
   		}
   		DWREngine.setAsync(true);
    }

    function processResult(value){
    	if ("yes" == value){
    		 ds.baseParams.params = ds_pid+" indexid in "+getStr(selectedTreeData);
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    		formPanelinsert.getForm().reset();
    		var form = formPanelinsert.getForm();
			form.findField("indexid").setValue(selectedTreeDataIndexid);
			form.findField("pid").setValue(currentPid);
			
			form.findField("ljr").setValue(username);
			form.findField("orgid").setValue(USERORGID);
			form.findField("zys").setValue('0');
			//var substr=selectedTreeData.substring(0,3);
		   //	form.findField("dh").setValue('0100'+'-'+selectedBM+"-");
		    //form.findField("mc").setValue('山西耀光煤电有限责任公司2×200MW机组');
    		
    	}else{
    		formWindow.hide();
            ds.baseParams.params = ds_pid+" indexid in "+getStr(selectedTreeData);
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    	}
    }
	function formCancel() {
		// formPanel.getForm().reset();
		formWindow.hide();
	}
	function assignUploadInfo() {

		var frame = window.frames["uploadIFrame"];
		uploadFileInfo = frame.document.body.innerText;
		/*
		var obj = eval('('+uploadFileInfo+')')
		var msg = obj.msg;
		if (obj.success){
			var form = formPanelinsert.getForm();
			form.findField("filename").setValue(msg[0].filename)
			form.findField("filelsh").setValue(msg[0].fileid)
		} else {
			//TODO
			alert("上传失败！")
		}
		*/
		if (uploadFileInfo.substring(0, 9) == "fieldname") {
			var c = (uploadFileInfo.substring(0, uploadFileInfo.length - 1))
					.split(SPLITA)
			var msg = c[3].split(SPLITB)[1];
			var fieldName;
			var fileid;
			var filename;
			if (msg.split(SPLITC)[0] == SUCCESS) {
				fieldName = c[0].split(SPLITB)[1];
				fileid = c[1].split(SPLITB)[1];

				filename = c[2].split(SPLITB)[1];

			}
			var form = formPanelinsert.getForm();
			form.findField("filename").setValue(filename)
			form.findField("filelsh").setValue(fileid)
			
		}
	}
	var formDialogWin;
	
	treePanel.on('click', function(node) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("treeid").innerText;
		selectedTreeDataIndexid = elNode.all("indexid").innerText;
		selectedBM = elNode.all("bm").innerText;
		grid.getTopToolbar().items.get('update').enable();
		PlantInt.indexid = selectedTreeData;
		var titles = [node.text];
		var obj = node.parentNode;
		var isRoot = (rootText == node.text);
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		tmp_parent = menu_isLeaf;

		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		if (selectedTreeData == null) {
			selectedTreeData = "";
		}
		ds.baseParams.params = ds_pid+" indexid in "+getStr(selectedTreeData)+" ";//order by bjhd asc, gdrq asc,dh asc
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});

	function  getStr(selectedTreeData){
       if(selectedTreeData == null || selectedTreeData == ''){
          selectedTreeData = '1'
	    }
	   if( selectedTreeData != ""){
	        	strs="(";
	        	DWREngine.setAsync(false);
	        	baseMgm.getData("select indexid from da_tree start with treeid='"+selectedTreeData+"' connect by prior   treeid=parent",
						function(list) {
						  if(list.length == 0) return strs +='';
						  for(var i = 0; i < list.length;i++){
						     if(list.length == 1){
						       strs +="'"+list[i]+"'";
					            break;
						     }
						     if(i < list.length -1 ){
						        strs +="'"+list[i]+"',";
						     }else{
						        strs +="'"+list[i]+"'";
						     }
						  }
						})
				DWREngine.setAsync(true);
				strs  +=")"
	        }
	        return strs;
        } 
});

function showUploadWin(fileid){
    //使用新的统一的在线打开的文件，此处使用appfile  zhangh 2013-11-25
    var docUrl = BASE_PATH + "jsp/common/open.file.online.jsp" +
                    "?fileid="+fileid+"" +
                    "&filetype=appfile" +
                    "&ModuleLVL="+ModuleLVL;
    window.showModalDialog(docUrl,"","dialogWidth:"
        + screen.availWidth + "px;dialogHeight:"
        + screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
}

function daflmlOpened(CellWeb){
	if(!bb){
		var flmllist = new Array();
		var indexid=selectedTreeData;
		DWREngine.setAsync(false);
		zlMgm.getflml(indexid, function(list){
				for (i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].XH);
				temp.push(list[i].DH);
				temp.push(list[i].MC);
				temp.push(list[i].DW);
				temp.push(list[i].BZRQ);
				temp.push(list[i].QX);
				temp.push(list[i].ZYS);
				temp.push(list[i].BZ);
				flmllist.push(temp);
			}
		});
		DWREngine.setAsync(true);
		var sheetx=0;		
		for(i=0;i<flmllist.length;i++){
			var page = parseInt(i/14);
			if(page>0 && page==(sheetx+1)){
				sheetx++;
				CellWeb.InsertSheet(page,1);
				CellWeb.CopySheet(page,0); 
			}
		}
		
		sheetx=0;
		var j=0;
		for(i=0;i<flmllist.length;i++){
			var page = parseInt(i/14);
			if(page>0 && page==(sheetx+1)){
				sheetx++;
				j=0;
			}
				
		    if(flmllist[i][0]!=null){
	    		CellWeb.S( 2, 4+j, sheetx, flmllist[i][0]);
	    	}
			if(flmllist[i][1]!=null){
				CellWeb.S( 3, 4+j, sheetx, flmllist[i][1]);
			}
			if(flmllist[i][2]!=null){
	    		CellWeb.S( 4, 4+j, sheetx, flmllist[i][2]);
			}
			if(flmllist[i][3]!=null){
				CellWeb.S( 5, 4+j, sheetx, flmllist[i][3]);
			}
	    	if(flmllist[i][4]!=null){
	    		CellWeb.S( 6, 4+j, sheetx, flmllist[i][4]);
	    	}
	    	if(flmllist[i][5]!=null){
	    		CellWeb.S( 7, 4+j, sheetx, flmllist[i][5]);
	    	}
	    	if(flmllist[i][6]!=null){
	    		CellWeb.S( 8, 4+j, sheetx, flmllist[i][6]);
	    	}
	    	
	    	if(flmllist[i][7]!=null){
	    		CellWeb.S( 10, 4+j, sheetx, Del(flmllist[i][7]));
	    	}
	    	j++;
		}
	}
    bb=true;
}
/*移除html标签和空格
		*/
	 function   Del(Word)   {   
		  a =Word.indexOf("<");   
		  b =Word.indexOf(">");   
		  len =Word.length;   
		  c  =Word.substring(0,   a);   
		  if(b ==-1)   
		  b  =a;   
		  d  =Word.substring((b   +   1),   len);   
		  Word  =c+d;   
		  tagCheck =Word.indexOf("<");   
		  if(tagCheck!=-1)   
		  Word =Del(Word);  
	  	  re=new   RegExp("&nbsp;","ig");   
	      var ss =Word.replace(re,"");        
		  return   ss;   
	  }   
function reportOpened(CellWeb) {
 	if(!ss){
 		var BillBj = new Array();
	 	//var ss=CellWeb.GetCols(0);//得到列
	 	//var ss=CellWeb.GetCurSheet();//得到表页
	 	//var ss=CellWeb.GetRows(0);//获得某页的总行数
    	var record = sm.getSelected();
		var id = record.get('daid');
		var rowcount;
	 	DWREngine.setAsync(false);
		zlMgm.getRowCount(id,function(value){  
					rowcount=value;
	       	});
		DWREngine.setAsync(true);
		DWREngine.setAsync(false);
		zlMgm.getqyml(id, function(list){
				for (i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].XH);
				temp.push(list[i].FILENO);
				temp.push(list[i].WEAVECOMPANY);
				temp.push(list[i].MATERIALNAME);
				temp.push(list[i].STOCKDATE);
				if(currentPid == '1031902'){
					temp.push(list[i].YS);//燃气将页数和页号合并为页号/页数shuz 2014-07-29
				}else{
					temp.push(list[i].YH);
				}
				temp.push(list[i].REMARK);
				BillBj.push(temp);
			}
		});
		DWREngine.setAsync(true);
		var sheetx=0;		
		for(i=0;i<BillBj.length;i++){
			var page = parseInt(i/15);
			if(page>0 && page==(sheetx+1)){
				sheetx++;
				CellWeb.InsertSheet(page,1);
				CellWeb.CopySheet(page,0); 
			}
		}
		
		sheetx=0;
		var j=0;
		for(i=0;i<BillBj.length;i++){
			var page = parseInt(i/15);
			if(page>0 && page==(sheetx+1)){
				sheetx++;
				j=0;
			}
		    if(BillBj[i][0]!=null){
	    		CellWeb.S( 2, 4+j, sheetx, BillBj[i][0]);
	    	}
			if(BillBj[i][1]!=null){
				CellWeb.S( 3, 4+j, sheetx, BillBj[i][1]);
			}
			if(BillBj[i][2]!=null){
	    		CellWeb.S( 4, 4+j, sheetx, BillBj[i][2]);
			}
			if(BillBj[i][3]!=null){
				CellWeb.S( 5, 4+j, sheetx, BillBj[i][3]);
			}
	    	if(BillBj[i][4]!=null){
	    		CellWeb.S( 6, 4+j, sheetx, formatDate(BillBj[i][4]));
	    	}
	    	if(BillBj[i][5]!=null){
	    		CellWeb.S( 7, 4+j, sheetx, BillBj[i][5]);
	    	}
	    	if(currentPid == '1031902'){
				if(BillBj[i][6]!=null){
		    		CellWeb.S( 8, 4+j, sheetx, BillBj[i][6]);
		    	}
	    	}else{
	    		if(BillBj[i][6]!=null){
		    		CellWeb.S( 8, 4+j, sheetx, BillBj[i][6]);
		    	}	 
	    	}
	    	if(BillBj[i][7]!=null){
		    		CellWeb.S( 9, 4+j, sheetx, BillBj[i][7]);
		    	}
	    	
	    	j++;
		}
	}
    ss=true;
}
//案卷移交
function reportOpened2(CellWeb){
	var record = sm.getSelected();
	var id = record.get('daid');
		var BillBj = new Array();
 	var sql = "select rownum,t.* from (select t.dh,t.mc,(select p.property_name from property_code p " +
 		" where p.type_name=(select r.uids from property_type r where r.type_name='立卷单位') " +
 		" and p.property_code=t.bzdw) bzdw,(case when t.bgqx='1' then '短期' when t.bgqx='2' "+
 		" then '长期' when t.bgqx='3' then '永久' end) bgqx,t.zys,t.bz from DA_ZL t where t.daid in('"+daids+"') order by dh asc) t";
 	DWREngine.setAsync(false);
	zlMgm.getListForCellBySql(sql, function(list){
			for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].ROWNUM);
			temp.push(list[i].DH);
			temp.push(list[i].MC);
			temp.push(list[i].ZYS)
			temp.push(list[i].BGQX);
			temp.push(list[i].BZDW);
			temp.push(list[i].BZ);
			BillBj.push(temp);
		}
	});
	DWREngine.setAsync(true);	
	var sheetx=0;		
	for(i=0;i<BillBj.length;i++){
		var page = parseInt(i/15);
		if(page>0 && page==(sheetx+1)){
			sheetx++;
			CellWeb.InsertSheet(page,1);
			CellWeb.CopySheet(page,0); 
		}
	}
	sheetx=0;
	var j=0;
	for(i=0;i<BillBj.length;i++){
		var page = parseInt(i/15);
		if(page>0 && page==(sheetx+1)){
			sheetx++;
			j=0;
		}
	    if(BillBj[i][0]!=null){
    		CellWeb.S( 2, 4+j, sheetx, BillBj[i][0]);
    	}
		if(BillBj[i][1]!=null){
			CellWeb.S( 3, 4+j, sheetx, BillBj[i][1]);
		}
		if(BillBj[i][2]!=null){
    		CellWeb.S( 4, 4+j, sheetx, BillBj[i][2]);
		}
		if(BillBj[i][3]!=null){
			CellWeb.S( 5, 4+j, sheetx, BillBj[i][3]);
		}
    	if(BillBj[i][4]!=null){
    		CellWeb.S( 6, 4+j, sheetx, BillBj[i][4]);
    	}
    	if(BillBj[i][5]!=null){
    		CellWeb.S( 7, 4+j, sheetx, BillBj[i][5]);
    	}
    	if(BillBj[i][6]!=null){
	    	CellWeb.S( 8, 4+j, sheetx, BillBj[i][6]);
	    }	 
    	j++;
	}
}
function reportOpened1(CellWeb) {
	if(reportArgs1 && reportArgs1!=null) {
		 	var BillBj = new Array();
			var sql ="select rownum, dh,mc, property_name,gdrq,bg,mj,ljr,bz,zy,zys from ("+ "select rownum, a.dh as dh,a.mc as mc, b.property_name, " +
					  " to_char(a.gdrq, 'YYYY.MM.DD') as gdrq, decode(a.bgqx, 1, '短期', 2, '长期', 3, '永久') as bg," +
					  " decode(a.mj, 1, '公开', 2, '机密', 3, '秘密', 4, ' 绝密') as mj, a.ljr as ljr, a.bz as bz, " +
					  "(select t.property_name from property_code t where t.type_name =(select r.uids from PROPERTY_TYPE r where r.type_name = '专业')" +
					  " and t.property_code = a.zy) as zy,a.zys"+
					  " from da_zl a, (select pc.property_code, pc.property_name from property_code pc," +
					  " property_type pt where pt.uids = pc.type_name and pt.type_name = '立卷单位') b " +
					  " where a.bzdw = b.property_code(+)  and  a.daid in ('"+reportArgs1.dafn+"')  order by dh asc)";
			DWREngine.setAsync(false);
			zlMgm.getListForCellBySql(sql, function(list){
					for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].ROWNUM);
					temp.push(list[i].DH);
					temp.push(list[i].MC);
					temp.push(list[i].PROPERTY_NAME);
					temp.push(list[i].GDRQ);
					temp.push(list[i].ZYS);
					temp.push(list[i].BG)
					temp.push(list[i].MJ);
					temp.push(list[i].LJR);
					temp.push(list[i].ZY);
					temp.push(list[i].BZ);
					BillBj.push(temp);
				}
			});
			DWREngine.setAsync(true);
			var sheetx=0;		
			for(i=0;i<BillBj.length;i++){
				var page = parseInt(i/15);
				if(page>0 && page==(sheetx+1)){
					sheetx++;
					CellWeb.InsertSheet(page,1);
					CellWeb.CopySheet(page,0); 
				}
			}
			
			sheetx=0;
			var j=0;
			for(i=0;i<BillBj.length;i++){
				var page = parseInt(i/15);
				if(page>0 && page==(sheetx+1)){
					sheetx++;
					j=0;
				}
			    if(BillBj[i][0]!=null){
		    		CellWeb.S( 2, 6+j, sheetx, BillBj[i][0]);
		    	}
				if(BillBj[i][1]!=null){
					CellWeb.S( 3, 6+j, sheetx, BillBj[i][1]);
				}
				if(BillBj[i][2]!=null){
		    		CellWeb.S( 4, 6+j, sheetx, BillBj[i][2]);
				}
				if(BillBj[i][3]!=null){
					CellWeb.S( 5, 6+j, sheetx, BillBj[i][3]);
				}
		    	if(BillBj[i][4]!=null){
		    		CellWeb.S( 6, 6+j, sheetx, BillBj[i][4]);
		    	}
		    	if(BillBj[i][5]!=null){
		    		CellWeb.S( 7, 6+j, sheetx, BillBj[i][5]);
		    	}
		    	if(BillBj[i][6]!=null){
		    		CellWeb.S( 8, 6+j, sheetx, BillBj[i][6]);
		    	}
		    	if(BillBj[i][7]!=null){
		    		CellWeb.S( 9, 6+j, sheetx, BillBj[i][7]);
		    	}
		    	if(BillBj[i][8]!=null){
		    		CellWeb.S( 10, 6+j, sheetx, BillBj[i][8]);
		    	}
		    	if(BillBj[i][9]!=null){
		    		CellWeb.S( 11, 6+j, sheetx, BillBj[i][9]);
		    	}
		    	if(BillBj[i][10]!=null){
		    		CellWeb.S( 12, 6+j, sheetx, BillBj[i][10]);
		    	}
		    	j++;
			}
		}
	}