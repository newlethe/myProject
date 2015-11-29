var bean = "com.sgepit.pmis.material.hbm.MatStoreOut";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = "uuid";
var orderColumn = "uuid";
var beanOut = "com.sgepit.pmis.material.hbm.MatStoreOutsub";
var PAGE_SIZE = 10;
var outTypeArr = [['1', '领料单'], ['2', '计划外出库'], ['3', '退料单'], ['4', '计划内领用']];
var pidWhereStr = "pid = '" + CURRENTAPPID + "'";

var typetreeArr = new Array();

Ext.onReady(function() {

	DWREngine.setAsync(false);
	var wareArray = new Array();// 查询出仓库
	baseMgm.getData("select uids,ckmc from wz_ckh where " + pidWhereStr + " ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					wareArray.push(temp);
				}
			})

	var userArray = new Array();// 申请人
	baseMgm.getData("select userid,realname from rock_user where unitid = '" + CURRENTAPPID + "' ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArray.push(temp);
				}
			})

	var deptArray = new Array();// 申请人部门
	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where UPUNIT = '" + CURRENTAPPID + "'", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					deptArray.push(temp);
				}
			});

	var billTypes = new Array();// 流程审批状态
	appMgm.getCodeValue('流程状态', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					billTypes.push(temp);
				}
			});
			
	//TODO:固定资产
    var sql1 = "select t.uids,t.fixedname from Facomp_Fixed_Asset_Tree t";
    baseDao.getData(sql1,function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);          
            temp.push(list[i][1]);         
            typetreeArr.push(temp);         
        }
    });			
	DWREngine.setAsync(true);

	
 	var typetreeDs = new Ext.data.SimpleStore({
	   fields: ['k', 'v'],   
	   data: typetreeArr
	}); 	
	/** ===================================出库主表begin========================================= */
	var fm = Ext.form;
	var fc = {
		'uuid' : {
			name : 'uuid',
			fieldLabel : '编号'
		},
		'outNo' : {
			name : 'outNo',
			fieldLabel : '出库单号'
		},
		'outDate' : {
			name : 'outDate',
			fieldLabel : '出库日期'
		},
		'sendWare' : {
			name : 'sendWare',
			fieldLabel : '发料仓库'
		},
		'dealMan' : {
			name : 'dealMan',
			fieldLabel : '经手人'
		},
		'dept' : {
			name : 'dept',
			fieldLabel : '部门'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注'
		},
		'outType' : {
			name : 'outType',
			fieldLabel : '出库类别'
		},
		'billState' : {
			name : 'billState',
			fieldLabel : '审批状态'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		}
	};

	var Columns = [{
				name : 'uuid',
				type : 'string'
			}, {
				name : 'outNo',
				type : 'string'
			}, {
				name : 'outDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'sendWare',
				type : 'string'
			}, {
				name : 'dealMan',
				type : 'string'
			}, {
				name : 'dept',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'outType',
				type : 'string'
			}, {
				name : 'billState',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'auditState',
				type : 'string'
			}];

	var sm = new Ext.grid.CheckboxSelectionModel({ singleSelect : true });
	sm.on('rowselect', function(sm, rowIndex, record) {
				var selectUuid = record.get('uuid');
				dsOut.baseParams.params = "outId = '" + selectUuid + "' and " + pidWhereStr + " ";
				dsOut.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});

	var cm = new Ext.grid.ColumnModel([sm, {
				id : 'uuid',
				header : fc['uuid'].fieldLabel,
				dataIndex : fc['uuid'].name,
				hidden : true
			}, {
				id : 'outNo',
				type : 'string',
				header : fc['outNo'].fieldLabel,
				dataIndex : fc['outNo'].name,
				align : 'center'
			}, {
				id : 'outDate',
				header : fc['outDate'].fieldLabel,
				dataIndex : fc['outDate'].name,
				align : 'center',
				renderer : function(value){
					return value ? value.dateFormat('Y-m-d') : '';
				}
			}, {
				id : 'sendWare',
				header : fc['sendWare'].fieldLabel,
				dataIndex : fc['sendWare'].name,
				align : 'center',
				renderer : function(value) {
					for (var i = 0; i < wareArray.length; i++) {
						if (wareArray[i][0] == value) {
							return wareArray[i][1];
						}
					}
				}
			}, {
				id : 'dealMan',
				header : fc['dealMan'].fieldLabel,
				dataIndex : fc['dealMan'].name,
				align : 'center',
				renderer : function(value) {
					for (var i = 0; i < userArray.length; i++) {
						if (value == userArray[i][0]) {
							return userArray[i][1]
						}
					}
				}
			}, {
				id : 'dept',
				header : fc['dept'].fieldLabel,
				dataIndex : fc['dept'].name,
				align : 'center',
				renderer : function(value) {
					for (var i = 0; i < deptArray.length; i++) {
						if (value == deptArray[i][0]) {
							return deptArray[i][1]
						}
					}
				}
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				align : 'center'
			}, {
				id : 'outType',
				header : fc['outType'].fieldLabel,
				dataIndex : fc['outType'].name,
				align : 'center',
				renderer : function(value) {
					for (var i = 0; i < outTypeArr.length; i++) {
						if (outTypeArr[i][0] == value) {
							return outTypeArr[i][1]
						}
					}
				}
			}, {
				id : 'billState',
				header : fc['billState'].fieldLabel,
				dataIndex : fc['billState'].name,
				align : 'center',
				hidden :　true,
				renderer : function(value) { // 单据状态类型
					for (var i = 0; i < billTypes.length; i++) {
						if (billTypes[i][0] == value) {
							return billTypes[i][1]
						}
					}
				}
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'auditState',
				header : '稽核状态',
				dataIndex : 'auditState',
				width : 80,
				align : 'center',
				renderer : function(v) {
					var str = '未稽核';
					if (v == '1') {
						str = '已稽核';
					} else if (v == '2') {
						str = '撤销稽核';
					}
					return str;
				}
			}]);
	cm.defaultSortable = true;// 可排序

	 var whereSql = "";
	if(edit_flag=='unplan'){
	    whereSql =  "outType='2' and auditState='1' and  "
	}else if(edit_flag=='plan'){
	    whereSql =  "outType='4' and auditState='1' and "
	}else{
	   whereSql =  " 1=2 and auditState='1' and "
	}
	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					params : whereSql + pidWhereStr
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort(orderColumn, 'asc');

	var gridPanel = new Ext.grid.GridPanel({
				ds : ds,
				cm : cm,
				sm : sm,
				region : 'north',
				border : false,
				height : 286,
				split : true,
				model : 'mini',
				stripeRows : true,
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>'+(edit_flag=='plan'?'计划内领用物资出库单':'计划外领用物资出库单')+'<B></font>', '->'],
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
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

	/**====================================出库主表end==========================================*/
	/**===================================出库子表begin=========================================*/

    var fcOut = {
			'uuid' : {
				name : 'uuid',
				fieldLabel : '编号',
				hidden : true,
				hideLabel : true
			},
			'outId' : {
				name : 'outId',
				fieldLabel : '出库单主键'
			},
			'matId' : {
				name : 'matId',
				fieldLabel : '材料主键'
			},
			'catNo' : {
				name : 'catNo',
				fieldLabel : '材料编码'
			},
			'catName' : {
				name : 'catName',
				fieldLabel : '材料名称'
			},
			'spec' : {
				name : 'spec',
				fieldLabel : '规格型号'
			},
			'unit' : {
				name : 'unit',
				fieldLabel : '库存单位'
			},
			'appNum' : {
				name : 'appNum',
				fieldLabel : '数量'
			},
			'realNum' : {
				name : 'realNum',
				fieldLabel : '领用数量'
			},
			'price' : {
				name : 'price',
				fieldLabel : '单价'
			},
			'money' : {
				name : 'money',
				fieldLabel : '金额'
			},
			'outType' : {
				name : 'outType',
				fieldLabel : '出库类别'
			},
			'pid' : {
				name : 'pid',
				fieldLabel : 'PID',
				hidden : true
			},
		'fixedAssetTreeid':{
		                name:'fixedAssetTreeid',
		                fieldLabel:'资产分类',
				        readOnly : true,
				        triggerClass: 'x-form-date-trigger',
				        onTriggerClick: function(){
				            fixedTypeWin.show();
				        },
				        listClass : 'display : none',
				        mode : 'local',
				        anchor : '95%',
				        valueField: 'k',
				        displayField: 'v',
				        lazyRender:true,
				        editable : false,
				        triggerAction: 'all',
				        store : typetreeDs
			 }
		};

	var ColumnsOut = [{
				name : 'uuid',
				type : 'string'
			}, {
				name : 'outId',
				type : 'string'
			}, {
				name : 'matId',
				type : 'string'
			}, {
				name : 'catNo',
				type : 'string'
			}, {
				name : 'catName',
				type : 'string'
			}, {
				name : 'spec',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'appNum',
				type : 'float'
			}, {
				name : 'realNum',
				type : 'float'
			}, {
				name : 'price',
				type : 'float'
			}, {
				name : 'money',
				type : 'string'
			}, {
				name : 'outType',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
			    name : 'fixedAssetTreeid',
			    type : 'string'
			}];

//	var smOut = new Ext.grid.CheckboxSelectionModel();
    var typetreeCombo  = new fm.ComboBox(fcOut['fixedAssetTreeid']);
    
	var cmOut = new Ext.grid.ColumnModel([smOut, {
				id : 'uuid',
				header : fcOut['uuid'].fieldLabel,
				dataIndex : fcOut['uuid'].name,
				hidden : true
			}, {
				id : 'outId',
				header : fcOut['outId'].fieldLabel,
				dataIndex : fcOut['outId'].name,
				hidden : true
			}, {
				id : 'matId',
				header : fcOut['matId'].fieldLabel,
				dataIndex : fcOut['matId'].name,
				hidden : true
			}, {
				id : 'catNo',
				header : fcOut['catNo'].fieldLabel,
				dataIndex : fcOut['catNo'].name,
				align : 'center'
			}, {
				id : 'catName',
				header : fcOut['catName'].fieldLabel,
				dataIndex : fcOut['catName'].name,
				align : 'center',
				width : 210
			}, {
			    id:'fixedAssetTreeid',header:fcOut['fixedAssetTreeid'].fieldLabel,
		            dataIndex:fcOut['fixedAssetTreeid'].name,align:'center',
		   			renderer : function(v,m,r){
							var treeName = "";
							m.attr = "style=background-color:#FBF8BF";
							for(var i=0;i<typetreeArr.length;i++){
								if(v == typetreeArr[i][0]){
									treeName = typetreeArr[i][1];
								}
							}
							return treeName;
				   },
			      editor :typetreeCombo
	       }, {
				id : 'spec',
				header : fcOut['spec'].fieldLabel,
				dataIndex : fcOut['spec'].name,
				align : 'center'
			}, {
				id : 'unit',
				header : fcOut['unit'].fieldLabel,
				dataIndex : fcOut['unit'].name,
				align : 'center'
			}, {
				id : 'appNum',
				header : fcOut['appNum'].fieldLabel,
				dataIndex : fcOut['appNum'].name,
				align : 'center',
				hidden : true
			}, {
				id : 'realNum',
				header : fcOut['realNum'].fieldLabel,
				dataIndex : fcOut['realNum'].name,
				align : 'center'
			}, {
				id : 'price',
				header : fcOut['price'].fieldLabel,
				dataIndex : fcOut['price'].name,
				align : 'center',
				randerer : function(v) {
					return v.toFixed(4);
				}
			}, {
				id : 'money',
				header : fcOut['money'].fieldLabel,
				dataIndex : fcOut['money'].name,
				align : 'center',
				renderer : function(value, cellmeta, record, rowIndex,
						columnIndex, store) {
					return "<div align=right>" + cnMoneyFour(record.data.realNum * record.data.price) + "</div>";
				}
			}, {
				id : 'outType',
				header : fcOut['outType'].fieldLabel,
				dataIndex : fcOut['outType'].name,
				align : 'center',
				renderer : function(value) {
					for (var i = 0; i < outTypeArr.length; i++) {
						if (outTypeArr[i][0] == value) {
							return outTypeArr[i][1]
						}
					}
				}
			}, {
				id : 'pid',
				header : fcOut['pid'].fieldLabel,
				dataIndex : fcOut['pid'].name,
				hidden : true
			}]);
	cmOut.defaultSortable = true;

	var dsOut = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanOut,
					business : business,
					method : listMethod,
					params : ''
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, ColumnsOut),
				remoteSort : true,
				pruneModifiedRecords : true
			});

	dsOut.setDefaultSort(orderColumn, 'asc');

	
	var PlantOut = Ext.data.Record.create(ColumnsOut);
	var PlantIntOut = {
				 uuid  : '',
				 outId  : '',
				 matId  : '',
				 catNo  : '',
				 catName  : '',
				 spec  : '',
				 unit  : '',
				 appNum  : '',
				 realNum  : '',
				 price  : '',
				 money  : '',
				 outType  : '',
				 pid  : PID,
			     fixedAssetTreeid  : ''
			};
	var gridPanelOut = new Ext.grid.EditorGridTbarPanel({
				ds : dsOut,
				cm : cmOut,
				sm : smOut,
				region : 'center',
				border : false,
				split : true,
				model : 'mini',
				stripeRows : true,
				header : false,
				addBtn:false,
				delBtn:false,
				saveBtn:true,
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>领料出库单明细<B></font>','-'],
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows: true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : dsOut,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : PlantOut,
				plantInt : PlantIntOut,
				servletUrl : MAIN_SERVLET,
				bean : beanOut,
				business : business,
				primaryKey : primaryKey
			});

	/**====================================出库子表end==========================================*/
	
    var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel, gridPanelOut]
			});

	ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});

    //保留小数点后4位
	function cnMoneyFour(v) {
		v = v.toFixed(4);
		v = String(v);
		var ps = v.split(".");
		var whole = ps[0];
		var sub = ps[1] ? "." + ps[1] : ".0000";
		var r = /(\d+)(\d{3})/;
		while (r.test(whole)) {
			whole = whole.replace(r, "$1" + "," + "$2");
		}
		v = whole + sub;
		if (v.charAt(0) == "-") {
			return "-￥" + v.substr(1);
		}
		return "￥" + v;
	}

		// 查询
	function onItemClick(item) {
		switch (item.id) {
			case 'query' :
				var begin = Ext.getCmp('begin').getValue();
				var end = Ext.getCmp('end').getValue();
				var outno = Ext.getCmp('outnoFie').getValue();
				var sql = '';
				if (begin != '') {
					begin = begin.format('Y-m-d') + ' 00:00:00';
				}
				if (end != '') {
					end = end.format('Y-m-d') + ' 23:59:59';
				}
				if (begin != '' && end != '' && end < begin) {
					Ext.example.msg("提示", "结束时间不能早于开始时间!");
					return;
				} else if (begin == '' && end != '') {
					sql += " and OUT_DATE <= to_date('" + end + "','yyyy-MM-dd hh24:mi:ss')";
				} else if (begin != '' && end != '') {
					sql += " and OUT_DATE >=to_date('" + begin + "','yyyy-MM-dd hh24:mi:ss') and OUT_DATE <= to_date('"
							+ end + "','yyyy-MM-dd hh24:mi:ss')";
				}
				if (outno) {
					sql += " and outNo like '%" + outno + "%'";
				}
				ds.baseParams.params = "outType='2' and " + pidWhereStr + sql;
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				break;
			case 'reset' :
				Ext.getCmp('begin').setValue('');
				Ext.getCmp('end').setValue(new Date);
				Ext.getCmp('outnoFie').setValue('');
				// 重置所有查询条件
				ds.baseParams.params = "outType='2' and " + pidWhereStr;
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				break;
		}
	}
});