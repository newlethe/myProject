var gridPanelMain
var gridPanelMat

var maxStockBhPrefix
var incrementLsh
var maxStockBh

var servletUrl = basePath + "servlet/MatServlet"

Ext.onReady(function() {
	maxStockBhPrefix = USERNAME + new Date().format('ym');
	DWREngine.setAsync(false);	
	stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","wz_cdjin_pb",null,function(dat){
		if(dat != "")	{
			maxStockBh = dat;
			incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
		}	
	})
	DWREngine.setAsync(true);
	
	var addConBtn = new Ext.Button({
		id: "btnSelectCon",
    	text:'选择采购合同',
    	tooltip:'从采购合同中选择',
    	iconCls : 'add',
    	handler:selectMatFun,
    	hidden: true
    })
    var addStorageBtn = new Ext.Button({
    	id: "btnSelectStorage",
    	text:'选择库存物资',
    	tooltip:'从库存物资中选择',
    	iconCls : 'add',
    	handler:selectMatFun
    })
	
	gridPanelMain = new Ext.grid.EditorGridTbarPanel({
		id : 'mainPanel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : [],
		border : false,
		region : 'north',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 200, 
		viewConfig : {
			forceFit : true,
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
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,		
		primaryKey : primaryKey 
	});
	gridPanelMain.on("afterinsert",function(){
		var rec = sm.getSelected();
		if(maxStockBh!= null){
			rec.set("bh",maxStockBh);
		} else{
			incrementLsh = incrementLsh +1
			rec.set("bh",maxStockBhPrefix + String.leftPad(incrementLsh,4,"0"))
		}
		maxStockBh = null;
		
	})	
	gridPanelMat = new Ext.grid.EditorGridTbarPanel({
		id : 'matPanel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [addStorageBtn,addConBtn],
		border : false,
		region : 'center',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
		//saveBtn: false,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties				
		//plant : PlantB,
		//plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		business : businessB,		
		primaryKey : primaryKeyB ,		
		crudText: {add:'选择采购计划'},
		insertHandler: collectStockFun,
		deleteHandler: deleteArriveMatFun
		//saveHandler: saveArriveMatFun
		
		
	});
	smB.on('rowselect',function(sm,rowIndex,record){
		var billTypeVal = record.get('billType');
		var cgbhVal = record.get('cgbh');
		
		var editorSjdj =cmB.getCellEditor(cmB.getIndexById("sjdj"),rowIndex);
		var editorSqsl =cmB.getCellEditor(cmB.getIndexById("sqsl"),rowIndex);
		var editorSv = cmB.getCellEditor(cmB.getIndexById("sv"),rowIndex);
		editorSjdj.addListener( "beforestartedit", handlerEdit)	
		editorSqsl.addListener( "beforestartedit", handlerEdit)	
		editorSv.addListener( "beforestartedit", handlerEdit)
		
		if (billTypeVal =="到货" && cgbhVal ==  "计划外"){
			/*editorSjdj.suspendEvents();
			editorSqsl.suspendEvents();			
			editorSv.suspendEvents();	*/	
			editorSjdj.removeListener("beforestartedit", handlerEdit)	
			editorSqsl.removeListener("beforestartedit", handlerEdit)
			editorSv.removeListener("beforestartedit", handlerEdit)		
			
		} else{
			/*editorSjdj.resumeEvents();
			editorSqsl.resumeEvents();
			editorSv.resumeEvents();*/
		}
		
		
		
		
			//editorSv.hide()
			//editorSqsl.hide()

		
		/*editor.on('beforestartedit', function(editor, boundEl, value) { 
			alert(billStateVal +"***")
	         if (billStateVal !=  "到货"){
	         		
	        		return false;   
	        } else{
	        	resumeEvents
	        }
	    }); */
	    /*colIndex = cmB.getIndexById("sv");
	    editor =cmB.getCellEditor(colIndex,rowIndex);
		editor.on('beforestartedit', function(editor, boundEl, value) {
	        if (billStateVal !=  "到货"){
	        		return false;   
	        } 
	    }); 
	    colIndex = cmB.getIndexById("sqsl");
	    editor =cmB.getCellEditor(colIndex,rowIndex);
		editor.on('beforestartedit', function(editor, boundEl, value) {   
	        if (billStateVal !=  "到货")	return false;   
	    }); */
	})
	
	function handlerEdit(editor, boundEl, value){
		return false;
	}
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false, 
		items: [gridPanelMain,gridPanelMat]
		
	}) 

	//-----------------------------------------从grid end---------------------------
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel],
		listeners: {
			afterlayout: function(){
				if (isFlwView == true){
					gridPanelMat.getTopToolbar().disable();
			    }
			}
		}
	});
	if (isFlwTask == true || isFlwView == true){
		ds.baseParams.params = " bh='"+Flowuids+"' and jhr ='" + USERID + "'";
    }else{
		ds.baseParams.params = " jhr ='" + USERID + "'";
    }
   	ds.load({ params:{start: 0, limit: PAGE_SIZE }});
   	
   	//汇总采购计划
	function collectStockFun(){
		if(sm.getSelected()==null){
			Ext.Msg.alert("提示", "请选择到货记录！");
			return 
		}
		var obj = new Object()
		obj.arriveUids = sm.getSelected().get("uids")
		obj.arriveBh =  sm.getSelected().get("bh")
		
		var rtn = window.showModalDialog(BASE_PATH + 'Business/wzgl/stock/selectStock.jsp',obj,"dialogWidth:1024px;dialogHeight:768px;center:yes;resizable:yes;")
		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
	}
	function deleteArriveMatFun(){
		if (smB.getCount() > 0) {
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
					text) {
				if (btn == "yes") {
					var records = smB.getSelections()
					var codes = []
					for (var i = 0; i < records.length; i++) {
						var m = records[i].get("uids")
						var billState = records[i].get("billState");
						if (m == "" || records[i].isNew || billState != "N") { // 主键值为空的记录、未保存的新增记录不计入
							continue;
						}
						codes[codes.length] = m
					}
					var mrc = codes.length
					if (mrc > 0) {
						var ids = codes.join(",");
						doDeleteArriveMat(mrc, ids)
					} else {
						dsB.reload();
					}
				}
			});
		}
	}
	
	function doDeleteArriveMat(mrc, ids) {
		Ext.Ajax.request({
			url : servletUrl,
			params : {
				ac : 'deleteArriveMat',
				ids : ids			
			},
			method : "GET",
			success : function(response, params) {
				var rspXml = response.responseXML
				var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue
				if (msg == "ok") {
					Ext.example.msg('删除成功！', '您成功删除了 {0} 条记录。', mrc);
					dsB.reload();
					dsB.rejectChanges(); // TODO 方法作用待进一步理解

				} else {
					var sa = rspXml.documentElement
							.getElementsByTagName("done").item(0).firstChild.nodeValue;
					var stackTrace = rspXml.documentElement
							.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
					var str = '第 ' + (sa * 1 + 1) + ' 条记录删除出错！<br>失败原因：' + msg;
					str += (sa * 1 > 0) ? '<br>本次操作保存删除 ' + sa + ' 条记录。' : "";
					Ext.MessageBox.show({
						title : '删除失败！',
						msg : str,
						width : 500,
						value : stackTrace,
						buttons : Ext.MessageBox.OK,
						multiline : true,
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			failure : function(response, params) {
				alert('Error: Delete failed!');
			}
		});
	}
	
	function selectMatFun(btn){
		
		if(btn.id == "btnSelectCon"){
			if(sm.getSelected()==null){
				Ext.Msg.alert("提示", "请选择到货记录！");
				return 
			}
			
			var csdm =  sm.getSelected().get("ghdw")
			Ext.Msg.alert("提示", "功能开发中！");
			/*if(csdm == null || csdm ==""){
				var rtn = window.showModalDialog(BASE_PATH + 'Business/wzgl/stock/selectStockCon.jsp',csdm,"dialogWidth:1024px;dialogHeight:600px;center:yes;resizable:yes;")
			}*/
			
		} else{
			if(sm.getSelected()==null){
				Ext.Msg.alert("提示", "请选择到货记录！");
				return 
			}
			var obj = new Object()
			obj.conId = sm.getSelected().get("bh")
			obj.conNo =  sm.getSelected().get("bh")		
			obj.funType = "Arrive"		
			var rtn = window.showModalDialog(BASE_PATH + 'Business/wzgl/stock/stockConSelectStorage.jsp',obj,"dialogWidth:1024px;dialogHeight:600px;center:yes;resizable:yes;")
			dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
		}
		
	}
	
	/*function saveArriveMatFun(){
		var ds = this.getStore()
		var records = ds.getModifiedRecords();
		if (records.length == 0)
			return;
		var daUpdate = [];
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			var recData = Ext.apply({}, record.data);
			for (var name in recData) {
				var field = record.store.recordType.getField(name);
				if (!gridPanelMat.validateField(field, i)){
					Ext.MessageBox.show({
						title : '保存失败！',
						msg : field.invalidText,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
					return;
				}
				if (field && (field.isExpr || field.rs)) {
					delete(recData[name]);
				}
			}
			var jsonData = Ext.encode(recData);
			daUpdate.push(jsonData);		
		}

		var mrc = da.length
		if (mrc > 0) {
			var dataArr = '[' + da.join(',') + ']';
			doSaveArriveMat(dataArr, mrc);
		}
	}
	
	function doSaveArriveMat(dataArr, mrc) {	
		Ext.Ajax.request({
			waitMsg : 'Saving changes...',
			url : servletUrl,
			params : {
				ac : "saveArriveMatAfterEdit",			
				primaryKey : primaryKeyB
			},
			method : "POST",
			xmlData : dataArr,
			success : function(response, params) {			
				var rspXml = response.responseXML
				var sa = rspXml.documentElement.getElementsByTagName("done")
						.item(0).firstChild.nodeValue;
				var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue;
				if (msg == "ok") {
					Ext.example.msg('保存成功！', '您成功保存了 {0} 条记录。', mrc);					
					dsB.commitChanges();
					dsB.rejectChanges(); // TODO 方法作用待进一步理解
					
				} else {
					var stackTrace = rspXml.documentElement
							.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
					var str = '第 ' + (sa * 1 + 1) + ' 条记录保存出错！<br>失败原因：' + msg;
					str += (sa * 1 > 0) ? '<br>本次操作保存成功 ' + sa + ' 条记录。' : "";

					Ext.MessageBox.show({
						title : '保存失败！',
						msg : str,
						width : 500,
						value : stackTrace,
						buttons : Ext.MessageBox.OK,
						multiline : true,
						icon : Ext.MessageBox.ERROR
					});
					
				}
			},
			failure : function(response, params) {
				alert('Error: Save failed!');				
			}
		});

	}*/
   	
});


