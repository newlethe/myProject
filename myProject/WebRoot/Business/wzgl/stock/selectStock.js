var matServlet =  CONTEXT_PATH + "/servlet/MatServlet"
var whereStr = "(cgr ='" + USERID+ "' or jhr ='" +USERID + "') and comid not in (select cgbh || ':' || bm from wz_input where pbbh='" + g_arriveBh+ "')";
Ext.onReady(function() {	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
		    history.back();
		}
	});
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'select',
		handler: selectHandler
	});
	
	var btnListAll = new Ext.Button({
		text: '列出所有',
		iconCls: 'refresh',
		handler: listAll
	});    
	var fm = Ext.form;			// 包名简写（缩写）
	var fcB = { 
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',  
			hideLabel : true
		},'bm' : {  
			name : 'bm',
			fieldLabel : '物资编码',  
			anchor : '95%'
		},'pm' : {
			name : 'pm',
			fieldLabel : '品名',
			anchor : '95%'
		},'gg' : {
			name : 'gg',
			fieldLabel : '规格型号',
			anchor : '95%'
		},'dw' : {
			name : 'dw',
			fieldLabel : '单位',
			anchor : '95%'
		},'jhdj' : {
			name : 'jhdj',
			fieldLabel : '计划单价',
			anchor : '95%'
		},'sjdj' : {
			name : 'sjdj',
			fieldLabel : '<font color="red"> 含税单价</font>',
			anchor : '95%'
		},'taxRate' : {
			name : 'taxRate',
			fieldLabel : '<font color="red"> 税率</font>',
			anchor : '95%'
		},'taxMoney' : {
			name : 'taxMoney',
			fieldLabel : '税额',
			anchor : '95%'
		},'curDhsl' : {
			name : 'curDhsl',
			fieldLabel : '<font color="red"> 本次到货</font>',  
			anchor : '95%'
		},'ygsl' : {
			name : 'ygsl',
			fieldLabel : '采购数量',
			anchor : '95%'
		},'dhsl' : {  
			name : 'dhsl',
			fieldLabel : '已到数量',  
			anchor : '95%'
		},'xz' : {  
			name : 'xz',
			fieldLabel : '采购方式',
			anchor : '95%'
		},'bh' : {  
			name : 'bh',
			fieldLabel : '采购计划',
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uids', type: 'string'},
    	{name: 'bm', type: 'string'},    		
		{name: 'pm', type: 'string'},
		{name: 'gg', type: 'string'},  	
		{name: 'dw', type: 'string'},
		{name: 'jhdj', type: 'float'},
		{name: 'sjdj', type: 'float'},	
		{name: 'taxRate', type: 'float'},		
		{name: 'taxMoney', type: 'float'},
		{name: 'curDhsl', type: 'float'},
		{name: 'ygsl', type: 'float'},	
		{name: 'dhsl', type: 'string'},	
		{name: 'bh', type: 'string'}
	];
	var smB = new Ext.grid.CheckboxSelectionModel()
	//-----------------------------------------从grid begin-------------------------
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uids',
		header : fcB['uids'].fieldLabel,
		dataIndex : fcB['uids'].name,
		hidden : true
	},{
		id : 'bh',
		header : fcB['bh'].fieldLabel,
		dataIndex : fcB['bh'].name
	},{
		id : 'bm',
		header : fcB['bm'].fieldLabel,
		dataIndex : fcB['bm'].name,
		width:100
	}, {
		id : 'pm',
		header : fcB['pm'].fieldLabel,
		dataIndex : fcB['pm'].name,
		width:100
	}, {
		id : 'gg',
		header : fcB['gg'].fieldLabel,
		dataIndex : fcB['gg'].name,
		width:200
	}, {
		id : 'dw',
		header : fcB['dw'].fieldLabel,
		dataIndex : fcB['dw'].name,
		width:40
	}, {
		id : 'jhdj',
		header : fcB['jhdj'].fieldLabel,
		dataIndex : fcB['jhdj'].name,
		hidden: true
	}, {
		id : 'sjdj',
		header : fcB['sjdj'].fieldLabel,
		dataIndex : fcB['sjdj'].name,
		width: 80,
		editor : new fm.NumberField(fcB['sjdj']),
		renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
	}, {
		id : 'taxRate',
		header : fcB['taxRate'].fieldLabel,
		dataIndex : fcB['taxRate'].name,
		width:40,
		editor : new fm.NumberField(fcB['taxRate']),
		renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
	},  {
		id : 'curDhsl',
		header : fcB['curDhsl'].fieldLabel,
		dataIndex : fcB['curDhsl'].name,
		width: 60,
		editor : new fm.NumberField(fcB['curDhsl']),
		renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
	},{
		id : 'taxMoney',
		header : fcB['taxMoney'].fieldLabel,
		dataIndex : fcB['taxMoney'].name,
		hidden:true
	}, {
		id : 'ygsl',
		header : fcB['ygsl'].fieldLabel,
		dataIndex : fcB['ygsl'].name,
		width: 80
	}, {
		id : 'dhsl',
		header : fcB['dhsl'].fieldLabel,
		dataIndex : fcB['dhsl'].name,
		width: 80
	}])
	cmB.defaultSortable = true;
	
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'listArriveCgjh',
			orderColumn: "bm",
			whereStr : whereStr
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : matServlet
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, ColumnsB),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort("bm", 'asc');
	var gridPanelB = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-gridB-panel',
		region: 'center',
		clicksToEdit : 1,
		saveBtn: false,
		addBtn: false,
		delBtn: false,
		ds : ds,
		cm : cmB,
		sm : smB,
		tbar : [btnSelect, '-', btnListAll],
		border : false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		loadMask : true, // 加载时是否显示进度
		height: 240, 
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
		})
	});
	
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanelB]
	});
	ds.load({ params:{start: 0, limit: PAGE_SIZE }});
    function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
   
    
  function selectHandler() {
		if (!smB.hasSelection()){
			return
		}
		var records = smB.getSelections()		
		var daUpdate = [];
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			var recData = Ext.apply({}, record.data);
			for (var name in recData) {

				var field = record.store.recordType.getField(name);
				if (!validateField(field, i)){
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

		var mrc = daUpdate.length
		if (mrc > 0) {
			var dataArr = '[' + daUpdate.join(',') + ']';
			var fph = "aaaaa";
			doSelect(dataArr, mrc, g_arriveUids, fph, function(flag, n) {
				/*for (var i = 0; i < n; i++) {
					records[i].isNew = false;
				}*/
			});
		}

	}
	function doSelect(dataArr, mrc, dhbh,fph, handler) {
		var ac = "arriveAndCreateInput"
		Ext.Ajax.request({
			waitMsg : '选择中...',
			url : matServlet,
			params : {
				ac : ac,				
				primaryKey : "uids",
				dhbh: dhbh,
				fph: fph
			},
			method : "POST",
			xmlData : dataArr,
			success : function(response, params) {
				// ds.on("load", this.saveSuccessMsg, ds) //TODO 暂无法实现显式函数
				var rspXml = response.responseXML
				var sa = rspXml.documentElement.getElementsByTagName("done")
						.item(0).firstChild.nodeValue;
				var msg = rspXml.documentElement.getElementsByTagName("msg")
						.item(0).firstChild.nodeValue;
				if (msg == "ok") {
					Ext.example.msg('成功！', '您选择了 {0} 条记录。', mrc);
					ds.commitChanges();					
					ds.rejectChanges(); // TODO 方法作用待进一步理解
					if (typeof(handler) == "function") {
						handler(true, sa)
					}
					window.close()
					
				} else {
					var stackTrace = rspXml.documentElement
							.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
					var str = '第 ' + (sa * 1 + 1) + ' 条记录操作时出错！<br>失败原因：' + msg;
					str += (sa * 1 > 0) ? '<br>本次操作成功选择了 ' + sa + ' 条记录。' : "";

					Ext.MessageBox.show({
						title : '操作失败！',
						msg : str,
						width : 500,
						value : stackTrace,
						buttons : Ext.MessageBox.OK,
						multiline : true,
						icon : Ext.MessageBox.ERROR
					});
					if (typeof(handler) == "function") {
						handler(false, sa)
					}
				}
			},
			failure : function(response, params) {
				alert('Error: Save failed!');
				if (typeof(handler) == "function") {
					handler(false, 0)
				}
			}
		});

	}
  
   function validateField(field, i){
		var colIndex = cmB.getIndexById(field.name)
		var colHeader = cmB.getColumnHeader(colIndex)
		if (cmB.isCellEditable(colIndex, i)){
			var editor = cmB.getCellEditor(colIndex, i)
			var conf = editor.initialConfig
			if(conf.allowBlank == false && field.defaultValue.trim() == ""){
				field.invalidText = "列：“"+colHeader+"”不允许为空！"
				return false
			}
		}
		return true
	}
   	
 
 
 	
 	// 列出所有物资
 	function listAll(){ 	
 		ds.load({ params:{start: null, limit: null }});
 	}
 	
 	
});

