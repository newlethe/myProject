var matServlet =  CONTEXT_PATH + "/servlet/MatServlet"
var whereStr = "(cgr ='"+USERID+"' or jhr ='"+USERID+"') and comid not in (select cgjhbh || ':' || bm from Con_mat where hth='"+g_conId+"') and pid = '"+CURRENTAPPID+"'";

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
		},'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
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
		{name: 'ygsl', type: 'float'},	
		{name: 'dhsl', type: 'string'},	
		{name: 'bh', type: 'string'},
		{name: 'pid', type: 'string'}
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
        type:'string',
		width:100
	}, {
		id : 'pm',
		header : fcB['pm'].fieldLabel,
		dataIndex : fcB['pm'].name,
        type:'string',
		width:100
	}, {
		id : 'gg',
		header : fcB['gg'].fieldLabel,
		dataIndex : fcB['gg'].name,
        type:'string',
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
		editor : new fm.NumberField(fcB['sjdj'])
	}, {
		id : 'ygsl',
		header : fcB['ygsl'].fieldLabel,
		dataIndex : fcB['ygsl'].name,
		width: 80
	}, {
		id : 'dhsl',
		header : fcB['dhsl'].fieldLabel,
		dataIndex : fcB['dhsl'].name,
		hidden:true,
		width: 80
	},{
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden:true
	}])
	cmB.defaultSortable = true;
	
	ds = new Ext.data.Store({
		baseParams : {
			//ac : 'listConCgjh',
			//orderColumn: "bm",
			//whereStr : whereStr
            //原始方式调用MatServlet，为了便于调用通用查询功能，
            //修改数据查询方式为通用方式 [ac:'list']，传递数据到MainServlet
            //zhangh 2012-11-16
            ac : 'list',
            bean : ' com.sgepit.pmis.wzgl.hbm.ViewWzConCgjh',
            business : 'baseMgm',
            method : 'findWhereOrderBy',
            params : "(cgr ='"+USERID+"' or jhr ='"+USERID+"') " +
                    " and comid not in (select cgjhbh || ':' || bm from ConMat where hth='"+g_conId+"') " +
                    " and pid = '"+CURRENTAPPID+"'"
            
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			//url : matServlet
            url : MAIN_SERVLET
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
    
	var queryWz = new Ext.Button({
        text : '查询',
        iconCls : 'option',
        handler : function(){
            showWindow(gridPanelB);
        }
    });
    //QueryExcelGridPanel
    //QueryExcelEditorGridPanel
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
		tbar : [btnSelect, '-', queryWz,'-',btnListAll],
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
	ds.load({ params:{start: 0, limit: PAGE_SIZE }});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanelB]
	});
	
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
			doSelect(dataArr, mrc, g_conId,function(flag, n) {});
		}

	}
	function doSelect(dataArr, mrc, hth,handler) {

		var ac = "crateConMatFromCgjh"
		Ext.Ajax.request({
			waitMsg : '选择中...',
			url : matServlet,
			params : {
				ac : ac,				
				primaryKey : "uids",
				hth: hth
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

