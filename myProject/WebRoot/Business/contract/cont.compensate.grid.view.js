var bean = "com.sgepit.pmis.contract.hbm.ConCla"
var business = "conclaMgm"
var listMethod = "findByProperty"
var primaryKey = "claid"
var propertyName = "conid"
var propertyValue = g_conid;
var SPLITB = "`"
var compensateTypes = new Array();
var billTypes = new Array();
Ext.onReady(function() {

	DWREngine.setAsync(false);
	appMgm.getCodeValue('合同索赔类型', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					compensateTypes.push(temp);
				}
			});
    appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });     			
	DWREngine.setAsync(true);

	var fcCompensate = {
		'conid' : {
			name : 'conid',
			fieldLabel : '合同号',
			hidden : true,
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			readOnly : true,
			hidden : true,
			anchor : '95%'
		},
		'claid' : {
			name : 'claid',
			fieldLabel : '索赔流水号',
			hidden : true,
			anchor : '95%'
		},
		'clano' : {
			name : 'clano',
			fieldLabel : '索赔编号',
			anchor : '95%'
		},
		'clatext' : {
			name : 'clatext',
			fieldLabel : '索赔情况',
			anchor : '95%'
		},
		'clawork' : {
			name : 'clawork',
			fieldLabel : '索赔处理',
			anchor : '95%'
		},
		'clamoney' : {
			name : 'clamoney',
			fieldLabel : '索赔金额',
			anchor : '95%'
		},
		'clatype' : {
			name : 'clatype',
			fieldLabel : '索赔类型',
			allowNegative : false,
			anchor : '95%'
		},
		'cladate' : {
			name : 'cladate',
			fieldLabel : '索赔日期',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'filelsh' : {
			name : 'filelsh',
			fieldLabel : '索赔附件流水号',
			hidden : true,
			anchor : '95%'
		},'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
         }   
	}

	var cmCompensate = new Ext.grid.ColumnModel([{
		id : 'conid',
		header : fcCompensate['conid'].fieldLabel,
		dataIndex : fcCompensate['conid'].name,
		hidden : true,
		width : 200
	}, {
		id : 'pid',
		header : fcCompensate['pid'].fieldLabel,
		dataIndex : fcCompensate['pid'].name,
		hidden : true,
		width : 120
	}, {
		header : fcCompensate['claid'].fieldLabel,
		dataIndex : fcCompensate['claid'].name,
		hidden : true,
		width : 120
	}, {
		header : fcCompensate['clano'].fieldLabel,
		dataIndex : fcCompensate['clano'].name,
		align : 'center',
		width : 120
	}, {
		header : fcCompensate['cladate'].fieldLabel,
		dataIndex : fcCompensate['cladate'].name,
		align : 'center',
		renderer : formatDate,
		width : 200
	}, {
		header : fcCompensate['clamoney'].fieldLabel,
		dataIndex : fcCompensate['clamoney'].name,
		width : 90,
		align : 'right',
		renderer : cnMoney
	}, {
		header : fcCompensate['clatext'].fieldLabel,
		dataIndex : fcCompensate['clatext'].name,
		align : 'center',
		hidden:true,
		width : 120
	}, {
		header : fcCompensate['clawork'].fieldLabel,
		dataIndex : fcCompensate['clawork'].name,
		align : 'center',
		hidden:true,
		width : 120
	}, {
		header : fcCompensate['clatype'].fieldLabel,
		dataIndex : fcCompensate['clatype'].name,
		align : 'center',
		renderer : compensateRender,
		width : 120
	}, {
		header : fcCompensate['filelsh'].fieldLabel,
		dataIndex : fcCompensate['filelsh'].name,
		hidden : true,
		width : 120
	},{
           header : fcCompensate['billstate'].fieldLabel,
           dataIndex :fcCompensate['billstate'].name,
           align : 'center',
           width: 120,
           renderer : function (v){
               for(var i=0;i<billTypes.length;i++){
                   if(v==billTypes[i][0]){
                       return billTypes[i][1]
                   }
               }
           }
        }

	]);
	cmCompensate.defaultSortable = true;

	// 3. 定义记录集
	var ColumnsCompensate = [{
		name : 'conid',
		type : 'string'
	}, {
		name : 'pid',
		type : 'string'
	}, {
		name : 'claid',
		type : 'string'
	}, {
		name : 'clano',
		type : 'string'
	}, {
		name : 'clatext',
		type : 'string'
	}, {
		name : 'cladate',
		type : 'date',
		dateFormat : 'Y-m-d H:i:s'
	}, {
		name : 'clamoney',
		type : 'float'
	}, {
		name : 'clawork',
		type : 'string'
	}, {
		name : 'clatype',
		type : 'string'
	}, {
		name : 'filelsh',
		type : 'string'
	},{
	    name : 'billstate',
	    type : 'string'
	}];

	// 4. 创建数据源
	var storeCompensate = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : propertyName + SPLITB + propertyValue
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, ColumnsCompensate),

		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
	});

	storeCompensate.on("load", function(ds) {
		if (ds.getCount() > 0) {
			parent.tabCompensate.getEl().setDisplayed("block");
		}
	})

	var gridCompensate = new Ext.grid.GridPanel({
		store : storeCompensate,
		cm : cmCompensate,
		border : false,
		// width:800,
		autoScroll : true, // 自动出现滚动条
		autoShow : true,
		region : 'center',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}/*
			 * , bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航 PAGE_SIZE:
			 * pageSize, store: storeCompensate, displayInfo: true, displayMsg: '
			 * {0} - {1} / {2}', emptyMsg: "无记录。" })
			 */
	});

	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
			layout : 'border',
			items : [gridCompensate],
			title : 'Simple Tasks',
			iconCls : 'icon-show-all'
		}).render();
	} else {
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [gridCompensate]
		});
	}

	storeCompensate.load(/*
							 * {params:{ start: 0, limit: PAGE_SIZE }}
							 */);

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function compensateRender(value) {
		var str = '';
		for (var i = 0; i < compensateTypes.length; i++) {
			if (compensateTypes[i][0] == value) {
				str = compensateTypes[i][1]
				break;
			}
		}
		return str;
	}

});